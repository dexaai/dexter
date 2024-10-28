import { type ChatResponse } from 'openai-fetch';
import { type PartialDeep, type SetOptional } from 'type-fest';

import { createOpenAIClient } from './clients/openai.js';
import { AbstractModel, type ModelArgs } from './model.js';
import { type Model, type Msg } from './types.js';
import { calculateCost } from './utils/calculate-cost.js';
import { deepMerge, mergeEvents, type Prettify } from './utils/helpers.js';
import { MsgUtil } from './utils/message-util.js';

export type ChatModelArgs<
  CustomCtx extends Model.Ctx,
  CustomClient extends Model.Chat.Client,
  CustomConfig extends Model.Chat.Config<CustomClient>,
> = SetOptional<
  ModelArgs<
    CustomClient,
    CustomConfig,
    Model.Chat.Run,
    Model.Chat.Response,
    CustomCtx
  >,
  'client' | 'params'
>;

export type PartialChatModelArgs<
  CustomCtx extends Model.Ctx,
  CustomClient extends Model.Chat.Client,
  CustomConfig extends Model.Chat.Config<CustomClient>,
> = Prettify<
  PartialDeep<
    Pick<
      ChatModelArgs<Partial<CustomCtx>, CustomClient, CustomConfig>,
      'params'
    >
  > &
    Partial<
      Omit<
        ChatModelArgs<Partial<CustomCtx>, CustomClient, CustomConfig>,
        'params'
      >
    >
>;

export class ChatModel<
  CustomCtx extends Model.Ctx,
  CustomClient extends Model.Chat.Client,
  CustomConfig extends Model.Chat.Config<CustomClient>,
> extends AbstractModel<
  CustomClient,
  CustomConfig,
  Model.Chat.Run,
  Model.Chat.Response,
  Model.Chat.ApiResponse,
  CustomCtx
> {
  modelType = 'chat' as const;
  modelProvider = 'openai';

  constructor(args: ChatModelArgs<CustomCtx, CustomClient, CustomConfig> = {}) {
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
      client: client as CustomClient,
      params: params as CustomConfig & Partial<Model.Chat.Run>,
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

    this.modelProvider = this.client.name;
  }

  protected async runModel<Cfg extends Model.Chat.Config<CustomClient>>(
    { handleUpdate, requestOpts, ...params }: Partial<Cfg> & Model.Chat.Run,
    context: CustomCtx
  ): Promise<Model.Chat.Response> {
    const start = Date.now();

    const allParams = {
      ...this.params,
      ...params,
      messages: params.messages ?? this.params.messages ?? [],
    };

    // Use non-streaming API if no handler is provided
    if (!handleUpdate) {
      // Make the OpenAI API request
      const response = await this.client.createChatCompletion(
        allParams,
        requestOpts
      );

      await Promise.allSettled(
        this.events?.onApiResponse?.map((event) =>
          Promise.resolve(
            event({
              timestamp: new Date().toISOString(),
              modelType: this.modelType,
              modelProvider: this.modelProvider,
              params: allParams,
              response,
              latency: Date.now() - start,
              context,
            })
          )
        ) ?? []
      );

      const message = MsgUtil.fromChatMessage(response.choices[0].message);

      const modelResponse: Model.Chat.Response = {
        ...response,
        message,
        cached: false,
        latency: Date.now() - start,
        cost: calculateCost({ model: allParams.model, tokens: response.usage }),
      };

      return modelResponse;
    } else {
      // Use the streaming API if a handler is provided
      const stream = await this.client.streamChatCompletion(
        allParams,
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
            message: choice.delta as ChatResponse['choices'][0]['message'],
            logprobs: choice.logprobs || null,
          },
        ],
      };

      // Calculate the token usage and add it to the response.
      // OpenAI doesn't provide token usage for streaming requests.
      const promptTokens = this.tokenizer.countTokens(params.messages);
      const messageContent = response.choices[0].message.content ?? '';
      const completionTokens = this.tokenizer.countTokens(messageContent);
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
              params: allParams,
              response,
              latency: Date.now() - start,
              context,
            })
          )
        ) ?? []
      );

      const message = MsgUtil.fromChatMessage(response.choices[0].message);

      const modelResponse: Model.Chat.Response = {
        ...response,
        message,
        cached: false,
        latency: Date.now() - start,
        cost: calculateCost({ model: allParams.model, tokens: response.usage }),
      };

      return modelResponse;
    }
  }

  /** Clone the model and merge/override the given properties. */
  extend(args?: PartialChatModelArgs<CustomCtx, CustomClient, Model.Chat.Config<CustomClient>>): this {
    const { client, params, ...rest } = args ?? {};
    return new ChatModel({
      cacheKey: this.cacheKey,
      cache: this.cache,
      client: client ?? this.client,
      debug: this.debug,
      telemetry: this.telemetry,
      ...rest,
      params: deepMerge(this.params, params),
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
function logInput(args: { params: { messages: Msg[] } }) {
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
    choices: { message: Msg }[];
    cost?: number;
  };
  params: { messages: Msg[] };
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

function logMessage(message: Msg, index: number) {
  console.debug(
    `[${index}] ${message.role.toUpperCase()}:${
      'name' in message ? ` (${message.name}) ` : ''
    }`
  );
  if (message.content) {
    console.debug(message.content);
  }
  if (MsgUtil.isFuncCall(message)) {
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
        console.error(`Failed to parse function call arguments`, err);
      }
    }
  } else if (MsgUtil.isToolCall(message)) {
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
          console.error(`Failed to parse tool call arguments`, err);
        }
      }
    }
  }
  console.debug();
}
