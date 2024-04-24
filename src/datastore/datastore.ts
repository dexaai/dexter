import type { Datastore } from './types.js';
import {
  type CacheKey,
  type CacheStorage,
  defaultCacheKey,
} from '../utils/cache.js';
import { mergeEvents } from '../utils/helpers.js';

export abstract class AbstractDatastore<
  DocMeta extends Datastore.BaseMeta,
  Filter extends Datastore.BaseFilter<DocMeta>,
> {
  protected abstract runQuery(
    query: Datastore.Query<DocMeta, Filter>,
    context?: Datastore.Ctx
  ): Promise<Datastore.QueryResult<DocMeta>>;
  abstract upsert(
    docs: Datastore.Doc<DocMeta>[],
    context?: Datastore.Ctx
  ): Promise<void>;
  abstract delete(docIds: string[]): Promise<void>;
  abstract deleteAll(): Promise<void>;

  /** Clones the datastore, optionally modifying it's config */
  abstract extend<Args extends Datastore.Opts<DocMeta, Filter>>(
    args?: Partial<Args>
  ): this;

  public abstract readonly datastoreType: Datastore.Type;
  public abstract readonly datastoreProvider: Datastore.Provider;

  protected readonly cacheKey: CacheKey<
    Datastore.Query<DocMeta, Filter>,
    string
  >;
  protected readonly cache?: CacheStorage<
    string,
    Datastore.QueryResult<DocMeta>
  >;

  public readonly contentKey: keyof DocMeta;
  public readonly embeddingModel: any;
  public readonly namespace?: string;
  public readonly events: Datastore.Events<DocMeta, Filter>;
  public readonly context: Datastore.Ctx;
  public readonly debug: boolean;

  constructor(args: Datastore.Opts<DocMeta, Filter>) {
    this.namespace = args.namespace;
    this.contentKey = args.contentKey;
    this.embeddingModel = args.embeddingModel;
    this.cacheKey = args.cacheKey ?? defaultCacheKey;
    this.cache = args.cache;
    this.context = args.context ?? {};
    this.debug = args.debug ?? false;
    this.events = mergeEvents(
      args.events,
      args.debug
        ? {
            onQueryStart: [console.debug],
            onQueryComplete: [console.debug],
            onError: [console.error],
          }
        : {}
    );
  }

  async query(
    query: Datastore.Query<DocMeta, Filter>,
    context?: Datastore.Ctx
  ): Promise<Datastore.QueryResult<DocMeta>> {
    const start = Date.now();
    const mergedContext = { ...this.context, ...context };

    await Promise.allSettled(
      this.events?.onQueryStart?.map((event) =>
        Promise.resolve(
          event({
            timestamp: new Date().toISOString(),
            datastoreType: this.datastoreType,
            datastoreProvider: this.datastoreProvider,
            query,
            context: mergedContext,
          })
        )
      ) ?? []
    );

    const cacheKey = await this.cacheKey(query);

    // Return cached response if available
    const cached = await Promise.resolve(this.cache?.get(cacheKey));
    if (cached) {
      await Promise.allSettled(
        this.events?.onQueryComplete?.map((event) =>
          Promise.resolve(
            event({
              timestamp: new Date().toISOString(),
              datastoreType: this.datastoreType,
              datastoreProvider: this.datastoreProvider,
              query,
              response: cached,
              cached: true,
              context: mergedContext,
              latency: Date.now() - start,
            })
          )
        ) ?? []
      );
      return {
        ...cached,
        cached: true,
      };
    }

    try {
      // Run the query
      const response = await this.runQuery(query, context);

      await Promise.allSettled(
        this.events?.onQueryComplete?.map((event) =>
          Promise.resolve(
            event({
              timestamp: new Date().toISOString(),
              datastoreType: this.datastoreType,
              datastoreProvider: this.datastoreProvider,
              query,
              response,
              cached: false,
              context: mergedContext,
              latency: Date.now() - start,
            })
          )
        ) ?? []
      );

      // Update the cache
      await Promise.resolve(this.cache?.set(cacheKey, response));

      return {
        ...response,
        cached: false,
      };
    } catch (error) {
      await Promise.allSettled(
        this.events?.onError?.map((event) =>
          Promise.resolve(
            event({
              timestamp: new Date().toISOString(),
              datastoreType: this.datastoreType,
              datastoreProvider: this.datastoreProvider,
              error,
              context: mergedContext,
            })
          )
        ) ?? []
      );
      throw error;
    }
  }
}
