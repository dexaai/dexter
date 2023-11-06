import { createTokenizer } from './utils/tokenizer.js';
import type { Model } from './types.js';
import { type Prettify, deepMerge } from '../utils/helpers.js';
import {
  type CacheKey,
  type CacheStorage,
  defaultCacheKey,
} from '../utils/cache.js';

export interface ModelArgs<
  MClient extends Model.Base.Client,
  MConfig extends Model.Base.Config,
  MRun extends Model.Base.Run,
  MResponse extends Model.Base.Response
> {
  /**
   * A function that returns a cache key for the given params.
   *
   * A simple example would be: `(params) => JSON.stringify(params)`
   *
   * The default `cacheKey` function uses [hash-obj](https://github.com/sindresorhus/hash-obj) to create a stable sha256 hash of the params.
   */
  cacheKey?: CacheKey<MRun & MConfig, string>;
  /**
   * Enables caching for model responses. Must implement `.get(key)` and `.set(key, value)`, both of which can be either sync or async.
   *
   * Some examples include: `new Map()`, [quick-lru](https://github.com/sindresorhus/quick-lru), or any [keyv adaptor](https://github.com/jaredwray/keyv).
   */
  cache?: CacheStorage<string, MResponse>;
  client: MClient;
  context?: Model.Ctx;
  params: MConfig & Partial<MRun>;
  events?: Model.Events<MRun & MConfig, MResponse>;
  /** Whether or not to add default `console.log` event handlers */
  debug?: boolean;
}

export abstract class AbstractModel<
  MClient extends Model.Base.Client,
  MConfig extends Model.Base.Config,
  MRun extends Model.Base.Run,
  MResponse extends Model.Base.Response,
  AResponse extends any = any
> {
  /** This is used to implement specific model calls */
  protected abstract runModel(
    params: Prettify<MRun & MConfig>,
    context: Model.Ctx
  ): Promise<MResponse>;

  /** Clone the model, optionally adding new arguments */
  abstract clone<Args extends ModelArgs<MClient, MConfig, MRun, MResponse>>(
    args?: Args
  ): this;

  abstract modelType: Model.Type;
  abstract modelProvider: Model.Provider;
  protected cacheKey: CacheKey<MRun & MConfig, string>;
  protected cache?: CacheStorage<string, MResponse>;
  protected client: MClient;
  protected context: Model.Ctx;
  protected debug: boolean;
  protected params: MConfig & Partial<MRun>;
  protected events: Model.Events<MRun & MConfig, MResponse, AResponse>;
  public tokenizer: Model.ITokenizer;

  constructor(args: ModelArgs<MClient, MConfig, MRun, MResponse>) {
    this.cacheKey = args.cacheKey ?? defaultCacheKey;
    this.cache = args.cache;
    this.client = args.client;
    this.context = args.context ?? {};
    this.debug = args.debug ?? false;
    this.params = args.params;
    this.events = args.events || {};
    this.tokenizer = createTokenizer(args.params.model);
  }

  async run(
    params: Prettify<MRun & Partial<MConfig>>,
    context?: Model.Ctx
  ): Promise<MResponse> {
    const start = Date.now();
    const mergedContext = this.mergeContext(this.context, context);
    const mergedParams = deepMerge(this.params, params) as MRun & MConfig;

    await Promise.allSettled(
      this.events.onStart?.map((event) =>
        Promise.resolve(
          event({
            timestamp: new Date().toISOString(),
            modelType: this.modelType,
            modelProvider: this.modelProvider,
            params: mergedParams,
            context: mergedContext,
          })
        )
      ) ?? []
    );

    const cacheKey = this.cacheKey(mergedParams);

    try {
      // Check the cache
      const cachedResponse =
        this.cache && (await Promise.resolve(this.cache.get(cacheKey)));
      if (cachedResponse) {
        const response: MResponse = {
          ...cachedResponse,
          cached: true,
          cost: 0,
          latency: Date.now() - start,
        };
        await Promise.allSettled(
          this.events.onComplete?.map((event) =>
            Promise.resolve(
              event({
                timestamp: new Date().toISOString(),
                modelType: this.modelType,
                modelProvider: this.modelProvider,
                params: mergedParams,
                response,
                context: mergedContext,
                cached: true,
              })
            )
          ) ?? []
        );
        return response;
      }

      // Run the model (e.g. make the API request)
      const response = await this.runModel(mergedParams, mergedContext);

      await Promise.allSettled(
        this.events.onComplete?.map((event) =>
          Promise.resolve(
            event({
              timestamp: new Date().toISOString(),
              modelType: this.modelType,
              modelProvider: this.modelProvider,
              params: mergedParams,
              response,
              context: mergedContext,
              cached: false,
            })
          )
        ) ?? []
      );

      // Update the cache
      await Promise.resolve(this.cache?.set(cacheKey, response));

      return response;
    } catch (error) {
      await Promise.allSettled(
        this.events?.onError?.map((event) =>
          Promise.resolve(
            event({
              timestamp: new Date().toISOString(),
              modelType: this.modelType,
              modelProvider: this.modelProvider,
              params: mergedParams,
              error,
              context: mergedContext,
            })
          )
        ) ?? []
      );
      throw error;
    }
  }

  /** Set the cache to a new cache. Set to undefined to remove existing. */
  setCache(cache: typeof this.cache | undefined): this {
    this.cache = cache;
    return this;
  }

  /** Get the current client */
  getClient() {
    return this.client;
  }

  /** Set the client to a new OpenAI API client. */
  setClient(client: typeof this.client): this {
    this.client = client;
    return this;
  }

  /** Get the current context */
  getContext() {
    return this.context;
  }

  /** Add the context. Overrides existing keys. */
  updateContext(context: typeof this.context): this {
    this.context = this.mergeContext(this.context, context);
    return this;
  }

  /** Set the context to a new context. Removes all existing values. */
  setContext(context: Model.Ctx): this {
    this.context = context;
    return this;
  }

  /** Get the current params */
  getParams() {
    return this.params;
  }

  /** Add the params. Overrides existing keys. */
  addParams(params: Partial<typeof this.params>): this {
    const modelChanged = params.model && params.model !== this.params.model;
    this.params = this.mergeParams(this.params, params);
    if (modelChanged) {
      this.tokenizer = createTokenizer(this.params.model);
    }
    return this;
  }

  /** Set the params to a new params. Removes all existing values. */
  setParams(params: typeof this.params): this {
    this.params = params;
    this.tokenizer = createTokenizer(this.params.model);
    return this;
  }

  /** Get the current event handlers */
  getEvents() {
    return this.events;
  }

  /** Add event handlers to the model. */
  addEvents(events: typeof this.events): this {
    this.events = this.mergeEvents(this.events, events);
    return this;
  }

  /**
   * Set the event handlers to a new set of events. Removes all existing event handlers.
   * Set to empty object `{}` to remove all events.
   */
  setEvents(events: typeof this.events): this {
    this.events = events;
    return this;
  }

  protected mergeContext(
    classContext: Model.Ctx,
    newContext?: Model.Ctx
  ): Model.Ctx {
    if (!newContext) return classContext;
    return deepMerge(classContext, newContext);
  }

  protected mergeParams(
    classParams: Partial<typeof this.params>,
    newParams: Partial<typeof this.params>
  ): typeof this.params {
    return deepMerge(classParams, newParams) as any;
  }

  protected mergeEvents(
    existingEvents: typeof this.events,
    newEvents: typeof this.events
  ): typeof this.events {
    return deepMerge(existingEvents, newEvents);
  }
}
