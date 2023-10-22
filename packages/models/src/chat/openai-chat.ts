import { deepmerge as deepmergeInit } from '@fastify/deepmerge';
import type { ChatResponse, ChatStreamResponse } from 'openai-fetch';
import { createOpenAIClient } from '../client/openai-client.js';
import type { ChatModel } from './types.js';
import { calculateOpenAICost } from '../utils/openai-cost.js';
import type { ITokenizer } from '../tokenizer/types.js';
import { createOpenAITokenizer } from '../tokenizer/openai-tokenizer.js';

const deepmerge = deepmergeInit();
type InnerType<T> = T extends ReadableStream<infer U> ? U : never;

export class OpenAIChatModel implements ChatModel.Class {
  private cache?: ChatModel.Properties['cache'];
  private client: ChatModel.Properties['client'];
  private context: ChatModel.Properties['context'];
  private params: ChatModel.Properties['params'];
  private hooks: ChatModel.Properties['hooks'];
  public tokenizer: ITokenizer;

  constructor(params: Partial<ChatModel.Properties> = {}) {
    this.cache = params.cache;
    this.client = params.client || createOpenAIClient();
    this.context = params.context || {};
    this.params = params.params || { model: 'gpt-3.5-turbo' };
    this.hooks = params.hooks || {};
    this.tokenizer = createOpenAITokenizer(this.params.model);
  }

  /** Set the cache to a new cache. */
  setCache(cache: ChatModel.Cache): void {
    this.cache = cache;
  }

  /** Set the client to a new OpenAI API client. */
  setClient(client: ChatModel.Properties['client']): void {
    this.client = client;
  }

  /** Add the context. Overrides existing keys. */
  updateContext(context: ChatModel.Context): void {
    this.context = this.mergeContext(this.context, context);
  }

  /** Set the context to a new context. Removes all existing values. */
  setContext(context: ChatModel.Context): void {
    this.context = context;
  }

  /** Add the params. Overrides existing keys. */
  addParams(params: ChatModel.GenerateParams): void {
    const modelChanged = params.model && params.model !== this.params.model;
    this.params = this.mergeParams(this.params, params);
    if (modelChanged) {
      this.tokenizer = createOpenAITokenizer(this.params.model);
    }
  }

  /** Set the params to a new params. Removes all existing values. */
  setParams(params: ChatModel.Params): void {
    this.params = params;
    this.tokenizer = createOpenAITokenizer(this.params.model);
  }

  /** Add hooks to the model. */
  addHooks(hooks: ChatModel.Hooks): void {
    this.hooks = this.mergeHooks(this.hooks, hooks);
  }

  /** Set the hooks to a new set of hooks. Removes all existing hooks. */
  setHooks(hooks: ChatModel.Hooks): void {
    this.hooks = hooks;
  }

  /** Clone the model and merge/orverride the given properties. */
  clone(
    params?: Partial<ChatModel.Properties>,
    context?: ChatModel.Context
  ): OpenAIChatModel {
    return new OpenAIChatModel({
      cache: params?.cache || this.cache,
      client: params?.client || this.client,
      context: this.mergeContext(this.context, context),
      params: this.mergeParams(
        this.params,
        (params?.params || {}) as ChatModel.GenerateParams
      ),
      hooks: this.mergeHooks(this.hooks, params?.hooks || {}),
    });
  }

  /** Generate an OpenAI chat response. */
  async generate(
    params: ChatModel.GenerateParams,
    context?: ChatModel.Context
  ): Promise<ChatModel.EnrichedResponse> {
    const start = performance.now();
    const mergedContext = this.mergeContext(this.context, context);
    const mergedParams = this.mergeParams(this.params, params);

    try {
      // Check the cache
      const cachedResponse = this.cache && (await this.cache.get(mergedParams));
      if (cachedResponse) {
        const response = {
          ...cachedResponse,
          cached: true,
          cost: 0,
          latency: performance.now() - start,
        };
        if (this.hooks?.onResponse) {
          this.hooks.onResponse.map((hook) =>
            hook(mergedParams, response, mergedContext)
          );
        }
        return response;
      }

      // Make the request
      const response = await this.client.createChatCompletion(mergedParams);

      // Enrich the response
      const enrichedResponse: ChatModel.EnrichedResponse = {
        ...response,
        cached: false,
        cost: calculateOpenAICost({
          model: mergedParams.model,
          tokens: {
            completion: response.usage?.completion_tokens,
            prompt: response.usage?.prompt_tokens,
          },
        }),
        latency: performance.now() - start,
      };

      // Cache the response
      if (this.cache) {
        await this.cache.set(mergedParams, enrichedResponse);
      }

      // Run the hooks
      if (this.hooks?.onResponse) {
        this.hooks.onResponse.map((hook) =>
          hook(mergedParams, enrichedResponse, mergedContext)
        );
      }

      return enrichedResponse;
    } catch (error) {
      if (this.hooks?.onError) {
        this.hooks.onError.forEach((hook) =>
          hook(mergedParams, error, mergedContext)
        );
      }
      throw error;
    }
  }

  /** Stream a chat response from the OpenAI API. */
  async stream(
    params: ChatModel.GenerateParams,
    /** Handle new chunks from streaming requests. */
    handleUpdate: (chunk: string) => void,
    context?: ChatModel.Context
  ): Promise<ChatModel.EnrichedResponse> {
    const start = performance.now();
    const mergedContext = this.mergeContext(this.context, context);
    const mergedParams = this.mergeParams(this.params, params);

    try {
      // Check the cache
      const cachedResponse = this.cache && (await this.cache.get(mergedParams));
      if (cachedResponse) {
        const response = {
          ...cachedResponse,
          cached: true,
          cost: 0,
          latency: performance.now() - start,
        };
        if (this.hooks?.onResponse) {
          this.hooks.onResponse.map((hook) =>
            hook(mergedParams, response, mergedContext)
          );
        }
        return response;
      }

      const stream = await this.client.streamChatCompletion(mergedParams);

      // Keep track of the stream's output
      let chunk = {} as InnerType<ChatStreamResponse>;

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
          chunk.choices[0].delta.function_call = deepmerge(
            chunk.choices[0].delta.function_call,
            function_call
          );
        }
      }

      // Once the stream is done, release the reader
      reader.releaseLock();

      const choice = chunk.choices[0];
      const response: ChatResponse = {
        ...chunk,
        choices: [
          {
            finish_reason:
              choice.finish_reason as ChatResponse['choices'][0]['finish_reason'],
            index: choice.index,
            message: choice.delta as ChatResponse['choices'][0]['message'],
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

      // Enrich the response
      const enrichedResponse: ChatModel.EnrichedResponse = {
        ...response,
        cached: false,
        cost: calculateOpenAICost({
          model: mergedParams.model,
          tokens: {
            completion: response.usage?.completion_tokens,
            prompt: response.usage?.prompt_tokens,
          },
        }),
        latency: performance.now() - start,
      };

      // Cache the response
      if (this.cache) {
        await this.cache.set(mergedParams, enrichedResponse);
      }

      // Run the hooks
      if (this.hooks?.onResponse) {
        this.hooks.onResponse.map((hook) =>
          hook(mergedParams, enrichedResponse, mergedContext)
        );
      }

      return enrichedResponse;
    } catch (error) {
      if (this.hooks?.onError) {
        this.hooks.onError.forEach((hook) =>
          hook(mergedParams, error, mergedContext)
        );
      }
      throw error;
    }
  }

  private mergeContext(
    classContext: ChatModel.Context,
    newContext?: ChatModel.Context
  ): ChatModel.Context {
    if (!newContext) return classContext;
    return deepmerge(classContext, newContext);
  }

  private mergeParams(
    classParams: ChatModel.Properties['params'],
    newParams: ChatModel.GenerateParams
  ): ChatModel.Params {
    return deepmerge(classParams, newParams) as ChatModel.Params;
  }

  private mergeHooks(
    existingHooks: ChatModel.Properties['hooks'],
    newHooks: ChatModel.Properties['hooks']
  ): ChatModel.Properties['hooks'] {
    return deepmerge(existingHooks, newHooks);
  }
}
