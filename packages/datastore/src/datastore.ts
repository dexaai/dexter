import type { Model } from '@dexaai/model';
import type { Dstore } from './types.js';

export abstract class AbstractDatastore<DocMeta extends Dstore.BaseMeta>
  implements Dstore.IDatastore<DocMeta>
{
  protected abstract runQuery(
    query: Dstore.Query<DocMeta>,
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
  protected embeddingModel: Model.Embedding.IModel;
  protected cache?: Dstore.Cache<DocMeta>;
  protected hooks: Dstore.Hooks<DocMeta>;
  protected context: Dstore.Ctx;

  constructor(args: Dstore.Opts<DocMeta>) {
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

  async query(
    query: Dstore.Query<DocMeta>,
    context?: Dstore.Ctx
  ): Promise<Dstore.QueryResult<DocMeta>> {
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
