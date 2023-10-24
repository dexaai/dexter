import type { SetOptional } from 'type-fest';
import type { ModelArgs } from '../model.js';
import { AbstractModel } from '../model.js';
import { createOpenAIClient, extractTokens } from './client.js';
import { calculateCost } from './costs.js';
import type { OpenAI } from './types.js';
import type { Model } from '../types2.js';
import { deepMerge } from '../utils/helpers.js';

export interface OChatConfig
  extends Model.Chat.Config,
    Omit<OpenAI.Chat.Params, 'messages'> {
  /** Handle new chunks from streaming requests. */
  handleUpdate?: (chunk: string) => void;
  model: string;
}

export type IOChatModel = Model.Chat.IModel<
  OChatConfig,
  Model.Chat.Run,
  Model.Chat.Response
>;

type InnerType<T> = T extends ReadableStream<infer U> ? U : never;
type ChatCompletionChunk = InnerType<OpenAI.Chat.StreamResponse>;

export class OChatModel
  extends AbstractModel<
    OpenAI.Client,
    OChatConfig,
    Model.Chat.Run,
    Model.Chat.Response,
    OpenAI.Chat.Response
  >
  implements IOChatModel
{
  modelType = 'chat' as const;
  modelProvider = 'openai' as const;

  constructor(
    args?: SetOptional<
      ModelArgs<
        OpenAI.Client,
        OChatConfig,
        Model.Chat.Run,
        Model.Chat.Response
      >,
      'client' | 'params'
    >
  ) {
    let { client, params, ...rest } = args ?? {};
    // Add a default client if none is provided
    client = client ?? createOpenAIClient();
    // Set default model if no params are provided
    params = params ?? { model: 'gpt-3.5-turbo' };
    super({ client, params, ...rest });
  }

  protected async runModel(
    { handleUpdate, ...params }: Model.Chat.Run & OChatConfig,
    context: Model.Ctx
  ): Promise<Model.Chat.Response> {
    const start = Date.now();

    // Use non-streaming API if no handler is provided
    if (!handleUpdate) {
      // Make the OpenAI API request
      const response = await this.client.createChatCompletion(params);

      this.hooks?.onApiResponse?.forEach((hook) =>
        hook({
          timestamp: new Date().toISOString(),
          modelType: this.modelType,
          modelProvider: this.modelProvider,
          params,
          response,
          latency: Date.now() - start,
          context,
        })
      );

      const tokens = extractTokens(response.usage);
      const modelResponse: Model.Chat.Response = {
        message: response.choices[0].message,
        cached: false,
        tokens,
        cost: calculateCost({ model: params.model, tokens }),
      };

      return modelResponse;
    } else {
      // Use the streaming API if a handler is provided
      const stream = await this.client.streamChatCompletion(params);

      // Keep track of the stream's output
      let chunk = {} as ChatCompletionChunk;

      // Get a reader from the stream
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // If the stream is done, break out of the loop and save the conversation
          // to the cache before returning.
          break;
        }

        // Create the initial chunk
        if (!chunk.id) {
          chunk = value;
        }

        const delta = value.choices[0].delta;

        // Send an update to the caller
        const messageContent = delta?.content;
        if (typeof messageContent === 'string') {
          try {
            handleUpdate(messageContent);
          } catch (err) {
            console.error('Error handling update', err);
          }
        }

        // Merge the delta into the chunk
        const { content, function_call } = delta;
        if (content) {
          chunk.choices[0].delta.content = `${chunk.choices[0].delta.content}${content}`;
        }
        if (function_call) {
          chunk.choices[0].delta.function_call = deepMerge(
            chunk.choices[0].delta.function_call,
            function_call
          );
        }
      }

      // Once the stream is done, release the reader
      reader.releaseLock();

      const choice = chunk.choices[0];
      const response: OpenAI.Chat.Response = {
        ...chunk,
        choices: [
          {
            finish_reason:
              choice.finish_reason as OpenAI.Chat.Response['choices'][0]['finish_reason'],
            index: choice.index,
            message: choice.delta as Model.Message,
          },
        ],
      };

      // Calculate the token usage and add it to the response.
      // OpenAI doesn't provide token usage for streaming requests.
      const promptTokens = this.tokenizer.countTokens(params.messages);
      const completionTokens = this.tokenizer.countTokens(
        response.choices[0].message
      );
      response.usage = {
        completion_tokens: completionTokens,
        prompt_tokens: promptTokens,
        total_tokens: promptTokens + completionTokens,
      };

      this.hooks?.onApiResponse?.forEach((hook) =>
        hook({
          timestamp: new Date().toISOString(),
          modelType: this.modelType,
          modelProvider: this.modelProvider,
          params,
          response,
          latency: Date.now() - start,
          context,
        })
      );

      const tokens = extractTokens(response.usage);
      const modelResponse: Model.Chat.Response = {
        message: response.choices[0].message,
        cached: false,
        tokens,
        cost: calculateCost({ model: params.model, tokens }),
      };

      return modelResponse;
    }
  }
}

// /**
//  * Pretty-print a list of messages to the console for debugging.
//  */
// function logMessages(args: {
//   messages: Model.Message[];
//   type: 'req' | 'res';
//   tokens?: TokenCounts;
//   latency?: number;
//   cost?: number;
// }) {
//   const tokens = args.tokens
//     ? `[Tokens: ${args.tokens.prompt} + ${args.tokens.completion} = ${args.tokens.total}]`
//     : null;
//   const latency = args.latency ? `[Latency: ${args.latency}ms]` : null;
//   const cost = args.cost ? `[Cost: $${(args.cost / 100).toFixed(5)}]` : null;
//   const meta = [latency, cost, tokens].filter(Boolean).join('---');
//   if (args.type === 'req') {
//     console.info(`-----> [Request] ----->`);
//   } else {
//     console.info(`<===== [Response] <===== ${meta}`);
//   }
//   console.debug();
//   args.messages.forEach(logMessage);
// }

// function logMessage(message: Model.Message, index: number) {
//   console.debug(
//     `[${index}] ${message.role.toUpperCase()}:${
//       message.name ? ` (${message.name}) ` : ''
//     }`
//   );
//   if (message.content) {
//     console.debug(message.content);
//   }
//   if (message.function_call) {
//     console.debug(`Function call: ${message.function_call.name}`);
//     if (message.function_call.arguments) {
//       try {
//         const formatted = JSON.stringify(
//           JSON.parse(message.function_call.arguments),
//           null,
//           2
//         );
//         console.debug(formatted);
//       } catch (err) {
//         console.debug(message.function_call.arguments);
//       }
//     }
//   }
//   console.debug();
// }
