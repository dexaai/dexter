import { deepMerge } from '../utils/helpers.js';
import { defaultCacheKey, } from '../utils/cache.js';
export class AbstractDatastore {
    contentKey;
    embeddingModel;
    namespace;
    cacheKey;
    cache;
    events;
    context;
    constructor(args) {
        this.namespace = args.namespace;
        this.contentKey = args.contentKey;
        this.embeddingModel = args.embeddingModel;
        this.cacheKey = args.cacheKey ?? defaultCacheKey;
        this.cache = args.cache;
        this.context = args.context ?? {};
        this.events = args.events ?? {};
        if (args.debug) {
            this.addEvents({
                onQueryStart: [console.debug],
                onQueryComplete: [console.debug],
                onError: [console.error],
            });
        }
    }
    async query(query, context) {
        const start = Date.now();
        const mergedContext = { ...this.context, ...context };
        await Promise.allSettled(this.events?.onQueryStart?.map((event) => Promise.resolve(event({
            timestamp: new Date().toISOString(),
            datastoreType: this.datastoreType,
            datastoreProvider: this.datastoreProvider,
            query,
            context: mergedContext,
        }))) ?? []);
        const cacheKey = this.cacheKey(query);
        // Return cached response if available
        const cached = await Promise.resolve(this.cache?.get(cacheKey));
        if (cached) {
            await Promise.allSettled(this.events?.onQueryComplete?.map((event) => Promise.resolve(event({
                timestamp: new Date().toISOString(),
                datastoreType: this.datastoreType,
                datastoreProvider: this.datastoreProvider,
                query,
                response: cached,
                cached: true,
                context: mergedContext,
                latency: Date.now() - start,
            }))) ?? []);
            return {
                ...cached,
                cached: true,
            };
        }
        try {
            // Run the query
            const response = await this.runQuery(query, context);
            await Promise.allSettled(this.events?.onQueryComplete?.map((event) => Promise.resolve(event({
                timestamp: new Date().toISOString(),
                datastoreType: this.datastoreType,
                datastoreProvider: this.datastoreProvider,
                query,
                response,
                cached: false,
                context: mergedContext,
                latency: Date.now() - start,
            }))) ?? []);
            // Update the cache
            await Promise.resolve(this.cache?.set(cacheKey, response));
            return {
                ...response,
                cached: false,
            };
        }
        catch (error) {
            await Promise.allSettled(this.events?.onError?.map((event) => Promise.resolve(event({
                timestamp: new Date().toISOString(),
                datastoreType: this.datastoreType,
                datastoreProvider: this.datastoreProvider,
                error,
                context: mergedContext,
            }))) ?? []);
            throw error;
        }
    }
    /** Get the current event handlers */
    getEvents() {
        return this.events;
    }
    /** Add event handlers to the datastore. */
    addEvents(events) {
        this.events = this.mergeEvents(this.events, events);
        return this;
    }
    /**
     * Set the event handlers to a new set of events. Removes all existing event handlers.
     * Set to empty object `{}` to remove all events.
     */
    setEvents(events) {
        this.events = events;
        return this;
    }
    mergeEvents(existingEvents, newEvents) {
        return deepMerge(existingEvents, newEvents);
    }
}
//# sourceMappingURL=datastore.js.map