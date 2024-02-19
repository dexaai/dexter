import type { Model } from '../model/index.js';
import type { Datastore } from './types.js';
import { type CacheKey, type CacheStorage } from '../utils/cache.js';
export declare abstract class AbstractDatastore<DocMeta extends Datastore.BaseMeta, Filter extends Datastore.BaseFilter<DocMeta>> {
    protected abstract runQuery(query: Datastore.Query<DocMeta, Filter>, context?: Datastore.Ctx): Promise<Datastore.QueryResult<DocMeta>>;
    abstract upsert(docs: Datastore.Doc<DocMeta>[], context?: Datastore.Ctx): Promise<void>;
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
    constructor(args: Datastore.Opts<DocMeta, Filter>);
    query(query: Datastore.Query<DocMeta, Filter>, context?: Datastore.Ctx): Promise<Datastore.QueryResult<DocMeta>>;
    /** Get the current event handlers */
    getEvents(): Datastore.Events<DocMeta, Filter>;
    /** Add event handlers to the datastore. */
    addEvents(events: typeof this.events): this;
    /**
     * Set the event handlers to a new set of events. Removes all existing event handlers.
     * Set to empty object `{}` to remove all events.
     */
    setEvents(events: typeof this.events): this;
    protected mergeEvents(existingEvents: typeof this.events, newEvents: typeof this.events): typeof this.events;
}
