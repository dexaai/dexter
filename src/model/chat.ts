import type { PartialDeep, SetRequired } from 'type-fest';
import type { SetOptional } from 'type-fest';
import type { ModelArgs } from './model.js';
import type { Model } from './types.js';
import { calculateCost } from './utils/calculate-cost.js';
import { createOpenAIClient } from './clients/openai.js';
import { AbstractModel } from './model.js';
import { deepMerge, mergeEvents, type Prettify } from '../utils/helpers.js';

export type ChatModelArgs<CustomCtx extends Model.Ctx> = SetOptional<
  ModelArgs<
    Model.Chat.Client,
    Model.Chat.Config,
    Model.Chat.Run,
    Model.Chat.Response,
    CustomCtx
  >,
  'client' | 'params'
>;

export type PartialChatModelArgs<CustomCtx extends Model.Ctx> = Prettify<
  PartialDeep<Pick<ChatModelArgs<Partial<CustomCtx>>, 'params'>> &
    Partial<Omit<ChatModelArgs<Partial<CustomCtx>>, 'params'>>
>;

export class ChatModel<
  CustomCtx extends Model.Ctx = Model.Ctx,
> extends AbstractModel<
  Model.Chat.Client,
  Model.Chat.Config,
  Model.Chat.Run,
  Model.Chat.Response,
  Model.Chat.ApiResponse,
  CustomCtx
> {
  modelType = 'chat' as const;
  modelProvider = 'openai' as const;

  constructor(args: ChatModelArgs<CustomCtx> = {}) {
    const {
      // Add a default client if none is provided
      client = createOpenAIClient(),
      // Set default model if no params are provided
      params = { model: 'gpt-3.5-turbo' },
      debug,
      events,
      ...rest
    } = args;

    super({
      client,
      params,
      debug,
      events: mergeEvents(
        events,
        debug
          ? {
              onStart: [logInput],
              onComplete: [logResponse],
            }
          : {}
      ),
      ...rest,
    });
  }

  protected async runModel(
    {
      handleUpdate,
      requestOpts,
      ...params
    }: Model.Chat.Run & Model.Chat.Config,
    context: CustomCtx
  ): Promise<Model.Chat.Response> {
    const start = Date.now();

    // Use non-streaming API if no handler is provided
    if (!handleUpdate) {
      // Make the OpenAI API request
      const response = await this.client.createChatCompletion(
        params,
        requestOpts
      );

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
      const stream = await this.client.streamChatCompletion(
        params,
        requestOpts
      );

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

        if (Object.keys(chunk).length === 0) {
          chunk = value;
        }

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
        const { content, function_call, tool_calls } = delta;
        if (content) {
          chunk.choices[0].delta.content = `${chunk.choices[0].delta.content}${content}`;
        }
        if (function_call) {
          const existingFunctionCall = chunk.choices[0].delta.function_call;
          chunk.choices[0].delta.function_call = {
            ...existingFunctionCall,
            arguments: `${existingFunctionCall?.arguments ?? ''}${function_call.arguments}`,
          };
        }
        if (tool_calls) {
          const existingToolCalls = chunk.choices[0].delta.tool_calls;
          if (!existingToolCalls) {
            chunk.choices[0].delta.tool_calls = tool_calls;
          } else {
            chunk.choices[0].delta.tool_calls = existingToolCalls.map(
              (existingToolCall) => {
                const matchingToolCall = tool_calls.find(
                  (toolCall) => toolCall.index === existingToolCall.index
                );
                if (!matchingToolCall) return existingToolCall;
                const existingArgs = existingToolCall.function?.arguments ?? '';
                const matchingArgs =
                  matchingToolCall?.function?.arguments ?? '';
                return {
                  ...existingToolCall,
                  function: {
                    ...existingToolCall.function,
                    arguments: `${existingArgs}${matchingArgs}`,
                  },
                };
              }
            );
          }
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
            message: choice.delta as SetRequired<
              Model.Chat.ResponseMessage,
              'refusal'
            >,
            logprobs: choice.logprobs || null,
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

  /** Clone the model and merge/override the given properties. */
  extend(args?: PartialChatModelArgs<CustomCtx>): this {
    return new ChatModel({
      cacheKey: this.cacheKey,
      cache: this.cache,
      client: this.client,
      debug: this.debug,
      ...args,
      params: deepMerge(this.params, args?.params),
      context:
        args?.context && Object.keys(args.context).length === 0
          ? undefined
          : deepMerge(this.context, args?.context),
      events:
        args?.events && Object.keys(args.events).length === 0
          ? undefined
          : mergeEvents(this.events, args?.events),
    }) as unknown as this;
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
