import { createTokenizer } from './utils/tokenizer.js';
import { deepMerge } from '../utils/helpers.js';
import { defaultCacheKey, } from '../utils/cache.js';
export class AbstractModel {
    cacheKey;
    cache;
    client;
    context;
    debug;
    params;
    events;
    tokenizer;
    constructor(args) {
        this.cacheKey = args.cacheKey ?? defaultCacheKey;
        this.cache = args.cache;
        this.client = args.client;
        this.context = args.context ?? {};
        this.debug = args.debug ?? false;
        this.params = args.params;
        this.events = args.events || {};
        this.tokenizer = createTokenizer(args.params.model);
    }
    async run(params, context) {
        const start = Date.now();
        const mergedContext = this.mergeContext(this.context, context);
        const mergedParams = deepMerge(this.params, params);
        await Promise.allSettled(this.events.onStart?.map((event) => Promise.resolve(event({
            timestamp: new Date().toISOString(),
            modelType: this.modelType,
            modelProvider: this.modelProvider,
            params: mergedParams,
            context: mergedContext,
        }))) ?? []);
        const cacheKey = this.cacheKey(mergedParams);
        try {
            // Check the cache
            const cachedResponse = this.cache && (await Promise.resolve(this.cache.get(cacheKey)));
            if (cachedResponse) {
                const response = {
                    ...cachedResponse,
                    cached: true,
                    cost: 0,
                    latency: Date.now() - start,
                };
                await Promise.allSettled(this.events.onComplete?.map((event) => Promise.resolve(event({
                    timestamp: new Date().toISOString(),
                    modelType: this.modelType,
                    modelProvider: this.modelProvider,
                    params: mergedParams,
                    response,
                    context: mergedContext,
                    cached: true,
                }))) ?? []);
                return response;
            }
            // Run the model (e.g. make the API request)
            const response = await this.runModel(mergedParams, mergedContext);
            await Promise.allSettled(this.events.onComplete?.map((event) => Promise.resolve(event({
                timestamp: new Date().toISOString(),
                modelType: this.modelType,
                modelProvider: this.modelProvider,
                params: mergedParams,
                response,
                context: mergedContext,
                cached: false,
            }))) ?? []);
            // Update the cache
            await Promise.resolve(this.cache?.set(cacheKey, response));
            return response;
        }
        catch (error) {
            await Promise.allSettled(this.events?.onError?.map((event) => Promise.resolve(event({
                timestamp: new Date().toISOString(),
                modelType: this.modelType,
                modelProvider: this.modelProvider,
                params: mergedParams,
                error,
                context: mergedContext,
            }))) ?? []);
            throw error;
        }
    }
    /** Set the cache to a new cache. Set to undefined to remove existing. */
    setCache(cache) {
        this.cache = cache;
        return this;
    }
    /** Get the current client */
    getClient() {
        return this.client;
    }
    /** Set the client to a new OpenAI API client. */
    setClient(client) {
        this.client = client;
        return this;
    }
    /** Get the current context */
    getContext() {
        return this.context;
    }
    /** Add the context. Overrides existing keys. */
    updateContext(context) {
        this.context = this.mergeContext(this.context, context);
        return this;
    }
    /** Set the context to a new context. Removes all existing values. */
    setContext(context) {
        this.context = context;
        return this;
    }
    /** Get the current params */
    getParams() {
        return this.params;
    }
    /** Add the params. Overrides existing keys. */
    addParams(params) {
        const modelChanged = params.model && params.model !== this.params.model;
        this.params = this.mergeParams(this.params, params);
        if (modelChanged) {
            this.tokenizer = createTokenizer(this.params.model);
        }
        return this;
    }
    /** Set the params to a new params. Removes all existing values. */
    setParams(params) {
        this.params = params;
        this.tokenizer = createTokenizer(this.params.model);
        return this;
    }
    /** Get the current event handlers */
    getEvents() {
        return this.events;
    }
    /** Add event handlers to the model. */
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
    mergeContext(classContext, newContext) {
        if (!newContext)
            return classContext;
        return deepMerge(classContext, newContext);
    }
    mergeParams(classParams, newParams) {
        return deepMerge(classParams, newParams);
    }
    mergeEvents(existingEvents, newEvents) {
        return deepMerge(existingEvents, newEvents);
    }
}
//# sourceMappingURL=model.js.map