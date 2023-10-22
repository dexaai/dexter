import { deepmerge as deepmergeInit } from '@fastify/deepmerge';
import { createOpenAIClient } from '../client/openai-client.js';
import type {
  ChatModelProperties,
  Context,
  EnrichedChatResponse,
  GenerateParams,
  IChatModel,
  ModelParams,
} from './types.js';
import { calculateOpenAICost } from '../utils/openai-cost.js';

const deepmerge = deepmergeInit();

export class OpenAIChatModel implements IChatModel {
  private cache?: ChatModelProperties['cache'];
  private client: ChatModelProperties['client'];
  private context: ChatModelProperties['context'];
  private params: ChatModelProperties['params'];
  private hooks: ChatModelProperties['hooks'];

  constructor(params: Partial<ChatModelProperties> = {}) {
    this.cache = params.cache;
    this.client = params.client || createOpenAIClient();
    this.context = params.context || {};
    this.params = params.params || { model: 'gpt-3.5-turbo' };
    this.hooks = params.hooks || {};
  }

  /** Set the cache to a new cache. */
  setCache(cache: ChatModelProperties['cache']): void {
    this.cache = cache;
  }

  /** Set the client to a new OpenAI API client. */
  setClient(client: ChatModelProperties['client']): void {
    this.client = client;
  }

  /** Add the context. Overrides existing keys. */
  updateContext(context: Context): void {
    this.context = this.mergeContext(this.context, context);
  }

  /** Set the context to a new context. Removes all existing values. */
  setContext(context: Context): void {
    this.context = context;
  }

  /** Add the params. Overrides existing keys. */
  addParams(params: GenerateParams): void {
    this.params = this.mergeParams(this.params, params);
  }

  /** Set the params to a new params. Removes all existing values. */
  setParams(params: ModelParams): void {
    this.params = params;
  }

  /** Add hooks to the model. */
  addHooks(hooks: ChatModelProperties['hooks']): void {
    this.hooks = this.mergeHooks(this.hooks, hooks);
  }

  /** Set the hooks to a new set of hooks. Removes all existing hooks. */
  setHooks(hooks: ChatModelProperties['hooks']): void {
    this.hooks = hooks;
  }

  /** Clone the model and merge/orverride the given properties. */
  clone(
    params?: Partial<ChatModelProperties>,
    context?: Context
  ): OpenAIChatModel {
    return new OpenAIChatModel({
      cache: params?.cache || this.cache,
      client: params?.client || this.client,
      context: this.mergeContext(this.context, context),
      params: this.mergeParams(
        this.params,
        (params?.params || {}) as GenerateParams
      ),
      hooks: this.mergeHooks(this.hooks, params?.hooks || {}),
    });
  }

  /** Stream a chat response from the OpenAI API. */
  // @TODO

  /** Generate an OpenAI chat response. */
  async generate(
    params: GenerateParams,
    context?: Context
  ): Promise<EnrichedChatResponse> {
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
      const enrichedResponse: EnrichedChatResponse = {
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

  private mergeContext(classContext: Context, newContext?: Context): Context {
    if (!newContext) return classContext;
    return deepmerge(classContext, newContext);
  }

  private mergeParams(
    classParams: ChatModelProperties['params'],
    newParams: GenerateParams
  ): ModelParams {
    return deepmerge(classParams, newParams) as ModelParams;
  }

  private mergeHooks(
    existingHooks: ChatModelProperties['hooks'],
    newHooks: ChatModelProperties['hooks']
  ): ChatModelProperties['hooks'] {
    return deepmerge(existingHooks, newHooks);
  }
}
