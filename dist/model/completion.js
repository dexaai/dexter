import { calculateCost } from './utils/calculate-cost.js';
import { createOpenAIClient } from './clients/openai.js';
import { AbstractModel } from './model.js';
export class CompletionModel extends AbstractModel {
    modelType = 'completion';
    modelProvider = 'openai';
    constructor(args) {
        let { client, params, ...rest } = args ?? {};
        // Add a default client if none is provided
        client = client ?? createOpenAIClient();
        // Set default model if no params are provided
        params = params ?? { model: 'gpt-3.5-turbo-instruct' };
        super({ client, params, ...rest });
    }
    async runModel(params, context) {
        const start = Date.now();
        // Make the OpenAI API request
        const response = await this.client.createCompletions(params);
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
            completion: response.choices[0].text,
            cached: false,
            cost: calculateCost({ model: params.model, tokens: response.usage }),
        };
        return modelResponse;
    }
    /** Clone the model and merge/orverride the given properties. */
    clone(args) {
        const { cacheKey, cache, client, context, debug, params, events } = args ?? {};
        // @ts-ignore
        return new CompletionModel({
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
//# sourceMappingURL=completion.js.map