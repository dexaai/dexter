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

interface OChatConfig
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

  async runModel(
    params: ChatRun & OChatConfig,
    context: Ctx
  ): Promise<ChatResponse> {
    const { handleUpdate, ...restParams } = params;
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
        timestamp: new Date().toISOString(),
        modelType: this.modelType,
        modelProvider: this.modelProvider,
        params: restParams,
        response,
        tokens,
        context,
        latency,
      });
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
        timestamp: new Date().toISOString(),
        modelType: this.modelType,
        modelProvider: this.modelProvider,
        params: restParams,
        response: response as OpenAIChatResponse,
        tokens,
        context,
        latency,
      });
      return { message, tokens };
    }
  }
}
