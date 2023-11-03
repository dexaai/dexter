import type { Model } from '../model/index.js';
import type { Dstore } from './types.js';
import { deepMerge } from './utils/helpers.js';

export abstract class AbstractDatastore<
  DocMeta extends Dstore.BaseMeta,
  Filter extends Dstore.BaseFilter<DocMeta>
> {
  protected abstract runQuery(
    query: Dstore.Query<DocMeta, Filter>,
    context?: Dstore.Ctx
  ): Promise<Dstore.QueryResult<DocMeta>>;
  abstract upsert(
    docs: Dstore.Doc<DocMeta>[],
    context?: Dstore.Ctx
  ): Promise<void>;
  abstract delete(docIds: string[]): Promise<void>;
  abstract deleteAll(): Promise<void>;

  abstract datastoreType: Dstore.Type;
  abstract datastoreProvider: Dstore.Provider;

  protected namespace: string;
  protected contentKey: keyof DocMeta;
  protected embeddingModel: Model.Embedding.Model;
  protected cache?: Dstore.Cache<DocMeta, Filter>;
  protected events: Dstore.Events<DocMeta, Filter>;
  protected context: Dstore.Ctx;

  constructor(args: Dstore.Opts<DocMeta, Filter>) {
    this.namespace = args.namespace;
    this.contentKey = args.contentKey;
    this.embeddingModel = args.embeddingModel;
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
    query: Dstore.Query<DocMeta, Filter>,
    context?: Dstore.Ctx
  ): Promise<Dstore.QueryResult<DocMeta>> {
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

    // Return cached response if available
    const cached = await this?.cache?.get(query);
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
      return cached;
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
              cached: true,
              context: mergedContext,
              latency: Date.now() - start,
            })
          )
        ) ?? []
      );

      // Update the cache
      await this?.cache?.set(query, response);

      return response;
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
