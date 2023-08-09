import Keyv from 'keyv';
import { KvCache } from 'tkv-cache';
import type {
  Ctx,
  Hooks,
  IModel,
  ModelCache,
  ModelConfig,
  ModelProvider,
  ModelResponse,
  ModelRun,
  ModelType,
  Prettify,
} from './types.js';

export interface ModelArgs<
  MConfig extends ModelConfig,
  MRun extends ModelRun,
  MResponse extends ModelResponse
> {
  cache?: ModelCache<MRun & MConfig, MResponse>;
  context?: Ctx;
  params: MConfig & Partial<MRun>;
  hooks?: Hooks<MRun & MConfig, MResponse>;
  debug?: boolean;
}

export abstract class AbstractModel<
  MConfig extends ModelConfig,
  MRun extends ModelRun,
  MResponse extends ModelResponse,
  AResponse extends any = any
> implements IModel<MConfig, MRun, MResponse>
{
  protected abstract runModel(
    params: Prettify<MRun & MConfig>,
    context: Ctx
  ): Promise<MResponse>;

  abstract modelType: ModelType;
  abstract modelProvider: ModelProvider;
  protected cache?: ModelCache<MRun & MConfig, MResponse>;
  protected context: Ctx;
  protected params: MConfig & Partial<MRun>;
  protected hooks: Hooks<MRun & MConfig, MResponse, AResponse>;

  constructor(args: ModelArgs<MConfig, MRun, MResponse>) {
    this.cache = args.cache;
    this.context = args.context ?? {};
    this.params = args.params;
    this.hooks = args.debug
      ? {
          afterApiResponse: console.log,
          afterCacheHit: console.log,
          beforeError: console.error,
          ...args.hooks,
        }
      : args.hooks || {};
  }

  /**
   * Add a cache to the model for storing responses
   * Defaults to an in-memory Keyv cache.
   */
  addCache(args?: {
    /** A Keyv instance to use for caching */
    keyv?: Keyv<MResponse>;
    /** Keyv options to create a new Keyv instance */
    keyvOpts?: Keyv.Options<MResponse>;
    /** A function to normalize the cache key */
    normalizeKey?: (params: MRun & MConfig) => Partial<MRun & MConfig>;
    errorHandler?: (error: unknown) => void;
  }): this {
    const { keyvOpts, normalizeKey, errorHandler } = args ?? {};
    const keyv = args?.keyv ?? new Keyv<MResponse>(keyvOpts);
    this.cache = new KvCache(keyv, normalizeKey, errorHandler);
    return this;
  }

  /** Add hooks to the model for logging and debugging */
  addHooks(hooks: Hooks<MRun & MConfig, MResponse, AResponse>): this {
    this.hooks = { ...this.hooks, ...hooks };
    return this;
  }

  async run(
    params: Prettify<MRun & Partial<MConfig>>,
    context?: Ctx
  ): Promise<MResponse> {
    // Merge the default params with the provided params
    const mergedParams: MRun & MConfig = {
      ...this.params,
      ...params,
    };
    const mergedContext = { ...this.context, ...context };

    // Return cached response if available
    const cached = await this?.cache?.get(mergedParams);
    if (cached) {
      await this.hooks.afterCacheHit?.({
        timestamp: new Date().toISOString(),
        modelType: this.modelType,
        modelProvider: this.modelProvider,
        params: mergedParams,
        response: cached,
        context: mergedContext,
      });
      return cached;
    }

    try {
      // Run the model (e.g. make the API request)
      const response = await this.runModel(mergedParams, mergedContext);

      // Update the cache
      await this?.cache?.set(mergedParams, response);

      return response;
    } catch (error) {
      await this.hooks.beforeError?.({
        timestamp: new Date().toISOString(),
        modelType: this.modelType,
        modelProvider: this.modelProvider,
        params: mergedParams,
        error,
        context: mergedContext,
      });
      throw error;
    }
  }
}
