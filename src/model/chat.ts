import type { SetOptional } from 'type-fest';
import type { ModelArgs } from './model.js';
import type { Model } from './types.js';
import { calculateCost } from './utils/calculate-cost.js';
import { createOpenAIClient } from './clients/openai.js';
import { AbstractModel } from './model.js';

export type ChatModelArgs = SetOptional<
  ModelArgs<
    Model.Chat.Client,
    Model.Chat.Config,
    Model.Chat.Run,
    Model.Chat.Response
  >,
  'client' | 'params'
>;

export class ChatModel extends AbstractModel<
  Model.Chat.Client,
  Model.Chat.Config,
  Model.Chat.Run,
  Model.Chat.Response,
  Model.Chat.ApiResponse
> {
  modelType = 'chat' as const;
  modelProvider = 'openai' as const;

  constructor(args?: ChatModelArgs) {
    let { client, params, ...rest } = args ?? {};
    // Add a default client if none is provided
    client = client ?? createOpenAIClient();
    // Set default model if no params are provided
    params = params ?? { model: 'gpt-3.5-turbo' };
    super({ client, params, ...rest });
    if (args?.debug) {
      this.addEvents({
        onStart: [logInput],
        onComplete: [logResponse],
      });
    }
  }

  protected async runModel(
    { handleUpdate, ...params }: Model.Chat.Run & Model.Chat.Config,
    context: Model.Ctx
  ): Promise<Model.Chat.Response> {
    const start = Date.now();

    // Use non-streaming API if no handler is provided
    if (!handleUpdate) {
      // Make the OpenAI API request
      const response = await this.client.createChatCompletion(params);

      await Promise.allSettled(
        this.events?.onApiResponse?.map((event) =>
          Promise.resolve(
            event({
              timestamp: new Date().toISOString(),
              modelType: this.modelType,
              modelProvider: this.modelProvider,
              params,
              response,
              latency: Date.now() - start,
              context,
            })
          )
        ) ?? []
      );

      const modelResponse: Model.Chat.Response = {
        ...response,
        message: response.choices[0].message,
        cached: false,
        latency: Date.now() - start,
        cost: calculateCost({ model: params.model, tokens: response.usage }),
      };

      return modelResponse;
    } else {
      // Use the streaming API if a handler is provided
      const stream = await this.client.streamChatCompletion(params);

      // Keep track of the stream's output
      let chunk = {} as Model.Chat.CompletionChunk;

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
        const { content, tool_calls } = delta;
                
        if (content) {
          chunk.choices[0].delta.content = `${chunk.choices[0].delta.content}${content}`;
        }
        
        if (tool_calls) {
          const mergedToolCalls = chunk.choices[0].delta.tool_calls || [];

          tool_calls.forEach((new_call) => {
            if (new_call.function && typeof new_call.function.arguments === 'string') {
              const index = new_call.index;
              let existing_call = mergedToolCalls.find(call => call.index === index);

              if (existing_call && existing_call.function) {
                existing_call.function.arguments = (existing_call.function.arguments || '') + new_call.function.arguments;
              } else {
                mergedToolCalls.push({...new_call, function: { ...new_call.function } });
              }
            }
          });

          chunk.choices[0].delta.tool_calls = mergedToolCalls;
        }
      }

      // Once the stream is done, release the reader
      reader.releaseLock();

      const choice = chunk.choices[0];
      const response: Model.Chat.ApiResponse = {
        ...chunk,
        object: 'chat.completion',
        choices: [
          {
            finish_reason:
              choice.finish_reason as Model.Chat.Response['choices'][0]['finish_reason'],
            index: choice.index,
            message: choice.delta as Model.Message & { role: 'assistant' },
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

      await Promise.allSettled(
        this.events?.onApiResponse?.map((event) =>
          Promise.resolve(
            event({
              timestamp: new Date().toISOString(),
              modelType: this.modelType,
              modelProvider: this.modelProvider,
              params,
              response,
              latency: Date.now() - start,
              context,
            })
          )
        ) ?? []
      );

      const modelResponse: Model.Chat.Response = {
        ...response,
        message: response.choices[0].message,
        cached: false,
        latency: Date.now() - start,
        cost: calculateCost({ model: params.model, tokens: response.usage }),
      };

      return modelResponse;
    }
  }

  /** Clone the model and merge/orverride the given properties. */
  clone(args?: ChatModelArgs): this {
    const { cacheKey, cache, client, context, debug, params, events } =
      args ?? {};

    // @ts-ignore
    return new ChatModel({
      cacheKey: cacheKey ?? this.cacheKey,
      cache: cache ?? this.cache,
      client: client ?? this.client,
      context: this.mergeContext(this.context, context),
      debug: debug ?? this.debug,
      params: this.mergeParams(this.params, params ?? {}),
      events: this.mergeEvents(this.events, events || {}),
    });
  }
}

/**
 * Verbose logging for debugging prompts
 */
function logInput(args: { params: { messages: Model.Message[] } }) {
  console.debug(`-----> [Request] ----->`);
  console.debug();
  args.params.messages.forEach(logMessage);
}

function logResponse(args: {
  response: {
    usage?: {
      completion_tokens: number;
      prompt_tokens: number;
    };
    cached: boolean;
    latency?: number;
    choices: { message: Model.Message }[];
    cost?: number;
  };
  params: { messages: Model.Message[] };
}) {
  const { usage, cost, latency, choices } = args.response;
  const tokens = {
    prompt: usage?.prompt_tokens ?? 0,
    completion: usage?.completion_tokens ?? 0,
    total: (usage?.prompt_tokens ?? 0) + (usage?.completion_tokens ?? 0),
  };
  const message = choices[0].message;
  const tokensStr = `[Tokens: ${tokens.prompt} + ${tokens.completion} = ${tokens.total}]`;
  const latencyStr = latency ? `[Latency: ${latency}ms]` : '';
  const costStr =
    typeof cost === 'number'
      ? `[Cost: $${(cost / 100).toFixed(5)}]`
      : `[Cost: UNKNOWN]`;
  const meta = [latencyStr, costStr, tokensStr].filter(Boolean).join('---');
  console.debug(`<===== [Response] <===== ${meta}`);
  console.debug();
  logMessage(message, args.params.messages.length + 1);
}

function logMessage(message: Model.Message, index: number) {
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
  } else if (message.tool_calls) {
    for (const toolCall of message.tool_calls) {
      const toolCallFunction = toolCall.function;
      console.debug(
        `tool call: ${toolCall.type}${
          toolCallFunction ? `:${toolCallFunction.name}` : ''
        } (id ${toolCall.id})`
      );
      if (toolCall.type !== 'function' || !toolCallFunction) continue;
      if (toolCallFunction.arguments) {
        try {
          const formatted = JSON.stringify(
            JSON.parse(toolCallFunction.arguments),
            null,
            2
          );
          console.debug(formatted);
        } catch (err) {
          console.debug(toolCallFunction.arguments);
        }
      }
    }
  }
  console.debug();
}
