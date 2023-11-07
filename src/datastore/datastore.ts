import type { Model } from '../model/index.js';
import type { Datastore } from './types.js';
import { deepMerge } from '../utils/helpers.js';
import {
  type CacheKey,
  type CacheStorage,
  defaultCacheKey,
} from '../utils/cache.js';

export abstract class AbstractDatastore<
  DocMeta extends Datastore.BaseMeta,
  Filter extends Datastore.BaseFilter<DocMeta>
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

  abstract datastoreType: Datastore.Type;
  abstract datastoreProvider: Datastore.Provider;

  protected contentKey: keyof DocMeta;
  protected embeddingModel: Model.Embedding.Model;
  protected namespace?: string;
  protected cacheKey: CacheKey<Datastore.Query<DocMeta, Filter>, string>;
  protected cache?: CacheStorage<string, Datastore.QueryResult<DocMeta>>;
  protected events: Datastore.Events<DocMeta, Filter>;
  protected context: Datastore.Ctx;

  constructor(args: Datastore.Opts<DocMeta, Filter>) {
    this.namespace = args.namespace;
    this.contentKey = args.contentKey;
    this.embeddingModel = args.embeddingModel;
    this.cacheKey = args.cacheKey ?? defaultCacheKey;
    this.cache = args.cache;
    this.context = args.context ?? {};
    this.events = args.events ?? {};
    if (args.debug) {
      this.mergeEvents(args.events ?? {}, {
        onQueryStart: [console.debug],
        onQueryComplete: [console.debug],
        onError: [console.error],
      });
    }
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

    const cacheKey = this.cacheKey(query);

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

  protected mergeEvents(
    existingEvents: typeof this.events,
    newEvents: typeof this.events
  ): typeof this.events {
    return deepMerge(existingEvents, newEvents);
  }
}
