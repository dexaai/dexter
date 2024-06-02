import type { PartialDeep } from 'type-fest';
import * as Sentry from '@sentry/node';
import {
  extractAttrsFromContext,
  extractAttrsFromParams,
  extractAttrsFromResponse,
  getSpanName,
} from './utils/telemetry.js';
import { createTokenizer } from './utils/tokenizer.js';
import type { Model } from './types.js';
import { deepMerge, type Prettify } from '../utils/helpers.js';
import {
  type CacheKey,
  type CacheStorage,
  defaultCacheKey,
} from '../utils/cache.js';

export interface ModelArgs<
  MClient extends Model.Base.Client,
  MConfig extends Model.Base.Config,
  MRun extends Model.Base.Run,
  MResponse extends Model.Base.Response,
  Ctx extends Model.Ctx,
> {
  /**
   * A function that returns a cache key for the given params.
   *
   * A simple example would be: `(params) => JSON.stringify(params)`
   *
   * The default `cacheKey` function uses [hash-object](https://github.com/sindresorhus/hash-object) to create a stable sha256 hash of the params.
   */
  cacheKey?: CacheKey<MRun & MConfig, string>;
  /**
   * Enables caching for model responses. Must implement `.get(key)` and `.set(key, value)`, both of which can be either sync or async.
   *
   * Some examples include: `new Map()`, [quick-lru](https://github.com/sindresorhus/quick-lru), or any [keyv adaptor](https://github.com/jaredwray/keyv).
   */
  cache?: CacheStorage<string, MResponse>;
  client: MClient;
  context?: Ctx;
  params: MConfig & Partial<MRun>;
  events?: Model.Events<MRun & MConfig, MResponse, Ctx>;
  /** Whether or not to add default `console.log` event handlers */
  debug?: boolean;
}

export type PartialModelArgs<
  MClient extends Model.Base.Client,
  MConfig extends Model.Base.Config,
  MRun extends Model.Base.Run,
  MResponse extends Model.Base.Response,
  CustomCtx extends Model.Ctx,
> = Prettify<
  PartialDeep<
    Pick<
      ModelArgs<MClient, MConfig, MRun, MResponse, Partial<CustomCtx>>,
      'params'
    >
  > &
    Partial<
      Omit<
        ModelArgs<MClient, MConfig, MRun, MResponse, Partial<CustomCtx>>,
        'params'
      >
    >
>;

export abstract class AbstractModel<
  MClient extends Model.Base.Client,
  MConfig extends Model.Base.Config,
  MRun extends Model.Base.Run,
  MResponse extends Model.Base.Response,
  AResponse extends any = any,
  CustomCtx extends Model.Ctx = Model.Ctx,
> {
  /** This is used to implement specific model calls */
  protected abstract runModel(
    params: Prettify<MRun & MConfig>,
    context: CustomCtx
  ): Promise<MResponse>;

  /** Clones the model, optionally modifying its config */
  abstract extend<
    Args extends PartialModelArgs<MClient, MConfig, MRun, MResponse, CustomCtx>,
  >(args?: Args): this;

  public abstract readonly modelType: Model.Type;
  public abstract readonly modelProvider: Model.Provider;

  protected readonly cacheKey: CacheKey<MRun & MConfig, string>;
  protected readonly cache?: CacheStorage<string, MResponse>;
  public readonly client: MClient;
  public readonly context: CustomCtx;
  public readonly debug: boolean;
  public readonly params: MConfig & Partial<MRun>;
  public readonly events: Model.Events<
    MRun & MConfig,
    MResponse,
    CustomCtx,
    AResponse
  >;
  public readonly tokenizer: Model.ITokenizer;

  constructor(args: ModelArgs<MClient, MConfig, MRun, MResponse, CustomCtx>) {
    this.cacheKey = args.cacheKey ?? defaultCacheKey;
    this.cache = args.cache;
    this.client = args.client;
    this.context = args.context ?? ({} as CustomCtx);
    this.debug = args.debug ?? false;
    this.params = args.params;
    this.events = args.events || {};
    this.tokenizer = createTokenizer(args.params.model);
  }

  async run(
    params: Prettify<MRun & Partial<MConfig>>,
    context?: CustomCtx
  ): Promise<MResponse> {
    const mergedContext = deepMerge(this.context, context);
    const mergedParams = deepMerge(this.params, params);

    // Handle signal separately since it's a instance of AbortSignal
    if (params.requestOpts?.signal && mergedParams.requestOpts) {
      mergedParams.requestOpts.signal = params.requestOpts.signal;
    }

    const spanName = getSpanName({
      modelType: this.modelType,
      ...mergedContext,
    });

    return Sentry.startSpan({ name: spanName, op: 'llm' }, async (span) => {
      const start = Date.now();

      span.setAttributes({
        ...extractAttrsFromContext(mergedContext),
        ...extractAttrsFromParams({
          modelType: this.modelType,
          modelProvider: this.modelProvider,
          ...mergedParams,
        }),
      });

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

      const cacheKey = await this.cacheKey(mergedParams);

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
          span.setAttributes(extractAttrsFromResponse(response));
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

        span.setAttributes(extractAttrsFromResponse(response));

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
    });
  }
}
