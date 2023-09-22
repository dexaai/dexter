import type { z } from 'zod';
import type {
  ChatConfig,
  ChatResponse,
  ChatRun,
  Ctx,
  IChatModel,
  Prettify,
  TokenCounts,
} from '../types.js';
import type { ModelArgs } from '../model.js';
import { AbstractModel } from '../model.js';
import { createOpenAIClient, extractTokens } from './client.js';
import { createTokenizer } from './tokenizer.js';
import type {
  ChatMessage,
  OpenAIChatModel,
  OpenAIChatParams,
  OpenAIChatResponse,
  OpenAIClient,
} from './client.js';
import { extractZodObject } from '../utils/extract-zod-object.js';
import { getErrorMessage } from '../utils/get-error-message.js';
import { calculateCost } from './costs.js';

export interface OChatConfig
  extends ChatConfig,
    Omit<OpenAIChatParams, 'messages' | 'user'> {
  /** Handle new chunks from streaming requests. */
  handleUpdate?: (chunk: string) => void;
  model: OpenAIChatModel;
}

export type IOChatModel = IChatModel<OChatConfig, ChatRun, ChatResponse>;

export class OChatModel
  extends AbstractModel<OChatConfig, ChatRun, ChatResponse, OpenAIChatResponse>
  implements IOChatModel
{
  modelType = 'chat' as const;
  modelProvider = 'openai' as const;
  openaiClient: OpenAIClient;

  constructor(
    args: Prettify<
      ModelArgs<OChatConfig, ChatRun, ChatResponse> & {
        openaiClient?: OpenAIClient;
      }
    >
  ) {
    const { openaiClient, ...rest } = args;
    super(rest);
    this.openaiClient = openaiClient || createOpenAIClient();
  }

  /**
   * Run the model and validate the response against a Zod schema.
   * Retries the request by passing the error message back into the model.
   */
  async runWithValidation<Schema extends z.ZodObject<any>>(
    schema: Schema,
    params: ChatRun & OChatConfig,
    context?: Ctx
  ): Promise<z.infer<Schema>> {
    const { message } = await this.run(params, context);
    if (!message.content) {
      throw new Error(`OpenAI returned a message with no content`);
    }
    try {
      return extractZodObject({ json: message.content, schema });
    } catch (error) {
      // Get the error message from the failed validation
      const errorMessage = getErrorMessage(error);

      // Add a message to the conversation with the error message and instruct
      // the model to try again.
      const appendedMessages: ChatMessage[] = [
        ...params.messages,
        message,
        {
          role: 'user',
          content: `There was an error parsing your response. Please read the error message and try again.\n\nError message: ${errorMessage}`,
        },
      ];
      const { message: message2 } = await this.run(
        {
          ...params,
          messages: appendedMessages,
        },
        {
          ...context,
          validationRetry: true,
        }
      );
      if (!message2.content) {
        throw new Error(`OpenAI returned a message with no content`);
      }

      return extractZodObject({ json: message2.content, schema });
    }
  }

  async runModel(
    params: ChatRun & OChatConfig,
    context: Ctx
  ): Promise<ChatResponse> {
    const { handleUpdate, ...restParams } = params;
    if (this.debug) {
      logMessages({ messages: params.messages, type: 'req' });
    }
    // Use non-streaming API if no handler is provided
    if (!handleUpdate) {
      const start = Date.now();
      const { message, response } =
        await this.openaiClient.createChatCompletion({
          user: typeof context.user === 'string' ? context.user : '',
          ...restParams,
        });
      const latency = Date.now() - start;
      const tokens = extractTokens(response.usage);
      await this.hooks.afterApiResponse?.({
        cost: calculateCost({ model: params.model, tokens }),
        timestamp: new Date().toISOString(),
        modelType: this.modelType,
        modelProvider: this.modelProvider,
        params: restParams,
        response,
        tokens,
        context,
        latency,
      });
      if (this.debug) {
        logMessages({
          cost: calculateCost({ model: params.model, tokens }),
          messages: [message],
          type: 'res',
          tokens,
          latency,
        });
      }
      return { message, tokens };
    } else {
      const start = Date.now();
      const stream = await this.openaiClient.streamChatCompletion({
        user: typeof context.user === 'string' ? context.user : '',
        ...restParams,
      });

      // Keep track of the stream's output
      let text = '';
      let role = '';
      let response = {};

      // Get a reader from the stream
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // If the stream is done, break out of the loop and save the conversation
          // to the cache before returning.
          break;
        }

        // Only set role once
        if (!role && value?.message?.role) {
          role = value.message.role;
        }

        response = { ...response, ...value?.response };

        // Send an update to the caller
        const messageContent = value?.message?.content;
        if (typeof messageContent === 'string') {
          text = `${text}${messageContent}`;
          try {
            // @TODO: Should this be throttled?
            handleUpdate(messageContent);
          } catch (err) {
            console.error('Error handling update', err);
          }
        }
      }

      // Once the stream is done, release the reader
      reader.releaseLock();
      const latency = Date.now() - start;

      // Construct the complete message
      const message: ChatMessage = {
        role: role as ChatMessage['role'],
        content: text,
      };

      // Streamed responses don't include token usage so we have to add it
      const tokenizer = createTokenizer(params.model);
      const promptTokens = tokenizer.countTokens(params.messages);
      const completionTokens = tokenizer.countTokens(message);
      const tokens: TokenCounts = {
        prompt: promptTokens,
        completion: completionTokens,
        total: promptTokens + completionTokens,
      };
      const responseUsage = {
        prompt_tokens: tokens.prompt,
        completion_tokens: tokens.completion,
        total_tokens: tokens.total,
      };
      response = { ...response, usage: responseUsage };

      await this.hooks.afterApiResponse?.({
        cost: calculateCost({ model: params.model, tokens }),
        timestamp: new Date().toISOString(),
        modelType: this.modelType,
        modelProvider: this.modelProvider,
        params: restParams,
        response: response as OpenAIChatResponse,
        tokens,
        context,
        latency,
      });
      if (this.debug) {
        logMessages({
          cost: calculateCost({ model: params.model, tokens }),
          messages: [message],
          type: 'res',
          tokens,
          latency,
        });
      }
      return { message, tokens };
    }
  }
}

/**
 * Pretty-print a list of messages to the console for debugging.
 */
function logMessages(args: {
  messages: ChatMessage[];
  type: 'req' | 'res';
  tokens?: TokenCounts;
  latency?: number;
  cost?: number;
}) {
  const tokens = args.tokens
    ? `[Tokens: ${args.tokens.prompt} + ${args.tokens.completion} = ${args.tokens.total}]`
    : null;
  const latency = args.latency ? `[Latency: ${args.latency}ms]` : null;
  const cost = args.cost ? `[Cost: $${(args.cost / 100).toFixed(5)}]` : null;
  const meta = [latency, cost, tokens].filter(Boolean).join('---');
  if (args.type === 'req') {
    console.info(`-----> [Request] ----->`);
  } else {
    console.info(`<===== [Response] <===== ${meta}`);
  }
  console.debug();
  args.messages.forEach(logMessage);
}

function logMessage(message: ChatMessage, index: number) {
  console.debug(
    `[${index}] ${message.role.toUpperCase()}:${
      message.name ? ` (${message.name}) ` : ''
    }`
  );
  if (message.content) {
    console.debug(message.content);
  }
  if (message.function_call) {
    console.debug(`Function call: ${message.function_call.name}`);
    if (message.function_call.arguments) {
      try {
        const formatted = JSON.stringify(
          JSON.parse(message.function_call.arguments),
          null,
          2
        );
        console.debug(formatted);
      } catch (err) {
        console.debug(message.function_call.arguments);
      }
    }
  }
  console.debug();
}
