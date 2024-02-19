import type { Model } from './types.js';
import { type Prettify } from '../utils/helpers.js';
import { type CacheKey, type CacheStorage } from '../utils/cache.js';
export interface ModelArgs<MClient extends Model.Base.Client, MConfig extends Model.Base.Config, MRun extends Model.Base.Run, MResponse extends Model.Base.Response> {
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
    context?: Model.Ctx;
    params: MConfig & Partial<MRun>;
    events?: Model.Events<MRun & MConfig, MResponse>;
    /** Whether or not to add default `console.log` event handlers */
    debug?: boolean;
}
export declare abstract class AbstractModel<MClient extends Model.Base.Client, MConfig extends Model.Base.Config, MRun extends Model.Base.Run, MResponse extends Model.Base.Response, AResponse extends any = any> {
    /** This is used to implement specific model calls */
    protected abstract runModel(params: Prettify<MRun & MConfig>, context: Model.Ctx): Promise<MResponse>;
    /** Clone the model, optionally adding new arguments */
    abstract clone<Args extends ModelArgs<MClient, MConfig, MRun, MResponse>>(args?: Args): this;
    abstract modelType: Model.Type;
    abstract modelProvider: Model.Provider;
    protected cacheKey: CacheKey<MRun & MConfig, string>;
    protected cache?: CacheStorage<string, MResponse>;
    protected client: MClient;
    protected context: Model.Ctx;
    protected debug: boolean;
    protected params: MConfig & Partial<MRun>;
    protected events: Model.Events<MRun & MConfig, MResponse, AResponse>;
    tokenizer: Model.ITokenizer;
    constructor(args: ModelArgs<MClient, MConfig, MRun, MResponse>);
    run(params: Prettify<MRun & Partial<MConfig>>, context?: Model.Ctx): Promise<MResponse>;
    /** Set the cache to a new cache. Set to undefined to remove existing. */
    setCache(cache: typeof this.cache | undefined): this;
    /** Get the current client */
    getClient(): MClient;
    /** Set the client to a new OpenAI API client. */
    setClient(client: typeof this.client): this;
    /** Get the current context */
    getContext(): Model.Ctx;
    /** Add the context. Overrides existing keys. */
    updateContext(context: typeof this.context): this;
    /** Set the context to a new context. Removes all existing values. */
    setContext(context: Model.Ctx): this;
    /** Get the current params */
    getParams(): MConfig & Partial<MRun>;
    /** Add the params. Overrides existing keys. */
    addParams(params: Partial<typeof this.params>): this;
    /** Set the params to a new params. Removes all existing values. */
    setParams(params: typeof this.params): this;
    /** Get the current event handlers */
    getEvents(): Model.Events<MRun & MConfig, MResponse, AResponse>;
    /** Add event handlers to the model. */
    addEvents(events: typeof this.events): this;
    /**
     * Set the event handlers to a new set of events. Removes all existing event handlers.
     * Set to empty object `{}` to remove all events.
     */
    setEvents(events: typeof this.events): this;
    protected mergeContext(classContext: Model.Ctx, newContext?: Model.Ctx): Model.Ctx;
    protected mergeParams(classParams: Partial<typeof this.params>, newParams: Partial<typeof this.params>): typeof this.params;
    protected mergeEvents(existingEvents: typeof this.events, newEvents: typeof this.events): typeof this.events;
}
