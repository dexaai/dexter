import Keyv from 'keyv';
import { KvCache } from 'tkv-cache';
import type { IEmbeddingModel, ISparseModel } from '@dexaai/model';
import type {
  BaseMeta,
  Ctx,
  DatastoreOpts,
  DatastoreProvider,
  DatastoreType,
  Doc,
  Hooks,
  HDatastoreOpts,
  IDatastore,
  Query,
  QueryCache,
  QueryResult,
} from './types.js';

export abstract class BaseDatastore<DocMeta extends BaseMeta>
  implements IDatastore<DocMeta>
{
  protected abstract runQuery(
    query: Query<DocMeta>,
    context?: Ctx
  ): Promise<QueryResult<DocMeta>>;
  abstract upsert(docs: Doc<DocMeta>[], context?: Ctx): Promise<void>;
  abstract delete(docIds: string[]): Promise<void>;
  abstract deleteAll(): Promise<void>;

  abstract datastoreType: DatastoreType;
  abstract datastoreProvider: DatastoreProvider;

  protected namespace: string;
  protected contentKey: keyof DocMeta;
  protected embeddingModel: IEmbeddingModel;
  protected cache?: QueryCache<DocMeta>;
  protected hooks: Hooks<DocMeta>;
  protected context: Ctx;

  constructor(args: DatastoreOpts<DocMeta>) {
    this.namespace = args.namespace;
    this.contentKey = args.contentKey;
    this.embeddingModel = args.embeddingModel;
    this.cache = args.cache;
    this.context = args.context ?? {};
    this.hooks = args.debug
      ? {
          afterApiResponse: console.log,
          afterCacheHit: console.log,
          beforeError: console.error,
          ...args.hooks,
        }
      : args.hooks ?? {};
  }

  /**
   * Add a cache to the datastore for storing query responses.
   * Defaults to an in-memory Keyv cache.
   */
  addCache(args?: {
    /** A Keyv instance to use for caching */
    keyv?: Keyv<QueryResult<DocMeta>>;
    /** Keyv options to create a new Keyv instance */
    keyvOpts?: Keyv.Options<QueryResult<DocMeta>>;
    /** A function to normalize the cache key */
    normalizeKey?: (params: Query<DocMeta>) => Partial<Query<DocMeta>>;
    errorHandler?: (error: unknown) => void;
  }): this {
    const { keyvOpts, normalizeKey, errorHandler } = args ?? {};
    const keyv = args?.keyv ?? new Keyv<QueryResult<DocMeta>>(keyvOpts);
    this.cache = new KvCache(keyv, normalizeKey, errorHandler);
    return this;
  }

  async query(
    query: Query<DocMeta>,
    context?: Ctx
  ): Promise<QueryResult<DocMeta>> {
    // Return cached response if available
    const cached = await this?.cache?.get(query);
    if (cached) {
      const mergedContext = { ...this.context, ...context };
      await this.hooks.afterCacheHit?.({
        timestamp: new Date().toISOString(),
        datastoreType: this.datastoreType,
        datastoreProvider: this.datastoreProvider,
        query,
        response: cached,
        context: mergedContext,
      });
      return cached;
    }

    try {
      // Run the query
      const response = await this.runQuery(query, context);

      // Update the cache
      await this?.cache?.set(query, response);

      return response;
    } catch (error) {
      const mergedContext = { ...this.context, ...context };
      await this.hooks.beforeError?.({
        timestamp: new Date().toISOString(),
        datastoreType: this.datastoreType,
        datastoreProvider: this.datastoreProvider,
        query,
        error,
        context: mergedContext,
      });
      throw error;
    }
  }
}

export abstract class BaseHybridDatastore<DocMeta extends BaseMeta>
  extends BaseDatastore<DocMeta>
  implements IDatastore<DocMeta>
{
  protected spladeModel: ISparseModel;

  constructor(args: HDatastoreOpts<DocMeta>) {
    const { spladeModel, ...rest } = args;
    super(rest);
    this.spladeModel = args.spladeModel;
  }
}
