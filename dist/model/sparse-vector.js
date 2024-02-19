import pThrottle from 'p-throttle';
import pMap from 'p-map';
import { AbstractModel } from './model.js';
import { createSpladeClient } from './clients/splade.js';
export class SparseVectorModel extends AbstractModel {
    modelType = 'sparse-vector';
    modelProvider = 'custom';
    serviceUrl;
    constructor(args) {
        const { serviceUrl, ...rest } = args;
        super({ client: createSpladeClient(), ...rest });
        const safeProcess = globalThis.process || { env: {} };
        const tempServiceUrl = serviceUrl || safeProcess.env['SPLADE_SERVICE_URL'];
        if (!tempServiceUrl) {
            throw new Error('Missing process.env.SPLADE_SERVICE_URL');
        }
        this.serviceUrl = tempServiceUrl;
    }
    async runModel(params, context) {
        const start = Date.now();
        const interval = params.throttleInterval ?? 1000 * 60; // 1 minute
        const limit = params.throttleLimit ?? 600;
        const concurrency = params.concurrency ?? 10;
        // Create a throttled version of the function for a single request
        const throttled = pThrottle({ limit, interval })(async (params) => this.runSingle(params, context));
        // Run the requests in parallel, respecting the maxConcurrentRequests value
        const inputs = params.input.map((input) => ({
            input,
            model: params.model,
        }));
        const responses = await pMap(inputs, throttled, { concurrency });
        return {
            vectors: responses.map((r) => r.vector),
            cached: false,
            latency: Date.now() - start,
        };
    }
    async runSingle(params, context) {
        const start = Date.now();
        const vector = await this.client.createSparseVector(params, this.serviceUrl);
        const latency = Date.now() - start;
        // Don't need tokens for this model
        const tokens = { prompt: 0, completion: 0, total: 0 };
        const { input, model } = params;
        await Promise.allSettled(this.events?.onApiResponse?.map((event) => Promise.resolve(event({
            timestamp: new Date().toISOString(),
            modelType: this.modelType,
            modelProvider: this.modelProvider,
            params: { input: [input], model },
            response: vector,
            latency,
            context,
        }))) ?? []);
        return { vector, tokens };
    }
    /** Clone the model and merge/orverride the given properties. */
    clone(args) {
        const { cacheKey, cache, context, debug, params, events } = args ?? {};
        // @ts-ignore
        return new SparseVectorModel({
            cacheKey: cacheKey || this.cacheKey,
            cache: cache || this.cache,
            context: this.mergeContext(this.context, context),
            debug: debug || this.debug,
            params: this.mergeParams(this.params, params ?? {}),
            events: this.mergeEvents(this.events, events || {}),
        });
    }
}
//# sourceMappingURL=sparse-vector.js.map