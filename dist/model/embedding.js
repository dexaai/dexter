import pThrottle from 'p-throttle';
import pMap from 'p-map';
import { calculateCost } from './utils/calculate-cost.js';
import { createOpenAIClient } from './clients/openai.js';
import { AbstractModel } from './model.js';
import { deepMerge } from '../utils/helpers.js';
const DEFAULTS = {
    /** The interval that the OpenAI API rate limit resets */
    throttleInterval: 1000 * 60, // 1 minute
    maxBatchSize: 10,
    maxTokensPerBatch: 20000,
    maxConcurrentRequests: 1,
    maxRequestsPerMin: 3500,
    model: 'text-embedding-ada-002',
};
export class EmbeddingModel extends AbstractModel {
    modelType = 'embedding';
    modelProvider = 'openai';
    throttledModel;
    /** Doesn't accept OpenAIClient because retry needs to be handled at the model level. */
    constructor(args) {
        let { client, params, ...rest } = args || {};
        client = client || createOpenAIClient();
        params = params || { model: DEFAULTS.model };
        super({ client, params, ...rest });
        const interval = DEFAULTS.throttleInterval;
        const limit = this.params.throttle?.maxRequestsPerMin || DEFAULTS.maxRequestsPerMin;
        // Create the throttled function
        this.throttledModel = pThrottle({ limit, interval })(async (params, context) => {
            const start = Date.now();
            // Make the request to OpenAI API to generate embeddings
            const response = await this.client.createEmbeddings({
                model: params.model,
                input: params.input,
            });
            await Promise.allSettled(this.events?.onApiResponse?.map((event) => Promise.resolve(event({
                timestamp: new Date().toISOString(),
                modelType: this.modelType,
                modelProvider: this.modelProvider,
                params,
                response,
                latency: Date.now() - start,
                context,
            }))) ?? []);
            const modelResponse = {
                ...response,
                embeddings: response.data.map((item) => item.embedding),
                cached: false,
                cost: calculateCost({ model: params.model, tokens: response.usage }),
            };
            return modelResponse;
        });
    }
    async runModel(params, context) {
        const start = Date.now();
        // Batch the inputs for the requests
        const batches = batchInputs({
            input: params.input,
            tokenizer: this.tokenizer,
            options: this.params.batch,
        });
        const mergedContext = deepMerge(this.context, context);
        // Make the requests in parallel, respecting concurrency setting
        const embeddingBatches = await pMap(batches.map((batch) => batch.map((input) => input.text)), async (batch) => {
            const response = await this.throttledModel({
                input: batch,
                model: this.params.model,
            }, mergedContext);
            return response;
        }, {
            concurrency: this.params.throttle?.maxConcurrentRequests ||
                DEFAULTS.maxConcurrentRequests,
        });
        // Flatten the batches of embeddings into a single array
        const embeddingsObjs = embeddingBatches.map((batch) => batch.data).flat();
        // Add up the tokens from the batches
        const totalTokens = batches.reduce((acc, curr) => {
            return acc + curr.reduce((acc, curr) => acc + curr.tokenCount, 0);
        }, 0);
        const { data: _, ...firstBatch } = embeddingBatches[0];
        const usage = { prompt_tokens: totalTokens, total_tokens: totalTokens };
        const modelResponse = {
            ...firstBatch,
            usage,
            data: embeddingsObjs,
            embeddings: embeddingBatches.map((batch) => batch.embeddings).flat(),
            cached: false,
            cost: calculateCost({ model: params.model, tokens: usage }),
            latency: Date.now() - start,
        };
        return modelResponse;
    }
    /** Clone the model and merge/orverride the given properties. */
    clone(args) {
        const { cacheKey, cache, client, context, debug, params, events } = args ?? {};
        // @ts-ignore
        return new EmbeddingModel({
            cacheKey: cacheKey ?? this.cacheKey,
            cache: cache ?? this.cache,
            client: client ?? this.client,
            context: this.mergeContext(this.context, context),
            debug: debug ?? this.debug,
            params: this.mergeParams(this.params, params ?? {}),
            events: this.mergeEvents(this.events, events || {}),
        });
    }
}
/**
 * Split text inputs into batches, respecting token limits and batch size.
 * @throws {Error} If an input exceeds the max tokens per batch.
 */
function batchInputs(args) {
    const { input: inputs, tokenizer, options } = args;
    const { maxTokensPerBatch = DEFAULTS.maxTokensPerBatch, maxBatchSize = DEFAULTS.maxBatchSize, } = options || {};
    // State for constructing batches
    const batches = [];
    let currentBatch = [];
    let currentBatchTokens = 0;
    for (let input of inputs) {
        const tokenCount = tokenizer.countTokens(input);
        // Ensure that the input does not exceed the max tokens per batch
        if (tokenCount > maxTokensPerBatch) {
            throw new Error(`Input exceeds max tokens per batch: ${tokenCount} > ${maxTokensPerBatch}`);
        }
        // Add the first input to the batch
        if (currentBatch.length === 0) {
            currentBatch.push({ text: input, tokenCount });
            currentBatchTokens += tokenCount;
            continue;
        }
        // Check if the input would exceed the max tokens per batch or max batch size
        const overTokenLimit = currentBatchTokens + tokenCount > maxTokensPerBatch;
        const overBatchSize = currentBatch.length + 1 > maxBatchSize;
        // Start a new batch if either limit would be exceeded
        if (overTokenLimit || overBatchSize) {
            batches.push(currentBatch);
            currentBatch = [{ text: input, tokenCount }];
            currentBatchTokens = tokenCount;
            continue;
        }
        // Add the input to the current batch
        currentBatch.push({ text: input, tokenCount });
        currentBatchTokens += tokenCount;
    }
    // Add the last batch
    if (currentBatch.length > 0) {
        batches.push(currentBatch);
    }
    return batches;
}
//# sourceMappingURL=embedding.js.map