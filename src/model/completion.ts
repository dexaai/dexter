import type { PartialDeep } from 'type-fest';
import type { SetOptional } from 'type-fest';
import type { ModelArgs } from './model.js';
import type { Model } from './types.js';
import { calculateCost } from './utils/calculate-cost.js';
import { createOpenAIClient } from './clients/openai.js';
import { AbstractModel } from './model.js';
import { deepMerge, mergeEvents, type Prettify } from '../index.js';

export type CompletionModelArgs = SetOptional<
  ModelArgs<
    Model.Completion.Client,
    Model.Completion.Config,
    Model.Completion.Run,
    Model.Completion.Response
  >,
  'client' | 'params'
>;

export type PartialCompletionModelArgs = Prettify<
  PartialDeep<Pick<CompletionModelArgs, 'params'>> &
    Partial<Omit<CompletionModelArgs, 'params'>>
>;

export class CompletionModel extends AbstractModel<
  Model.Completion.Client,
  Model.Completion.Config,
  Model.Completion.Run,
  Model.Completion.Response,
  Model.Completion.ApiResponse
> {
  modelType = 'completion' as const;
  modelProvider = 'openai' as const;

  constructor(args?: CompletionModelArgs) {
    let { client, params, ...rest } = args ?? {};
    // Add a default client if none is provided
    client = client ?? createOpenAIClient();
    // Set default model if no params are provided
    params = params ?? { model: 'gpt-3.5-turbo-instruct' };
    super({ client, params, ...rest });
  }

  protected async runModel(
    params: Model.Completion.Run & Model.Completion.Config,
    context: Model.Ctx
  ): Promise<Model.Completion.Response> {
    const start = Date.now();

    // Make the OpenAI API request
    const response = await this.client.createCompletions(params);

    await Promise.allSettled(
      this.events?.onApiResponse?.map((event) =>
        Promise.resolve(
          event({
            timestamp: new Date().toISOString(),
            modelType: this.modelType,
            modelProvider: this.modelProvider,
            params,
            response,
            latency: Date.now() - start,
            context,
          })
        )
      ) ?? []
    );

    const modelResponse: Model.Completion.Response = {
      ...response,
      completion: response.choices[0].text,
      cached: false,
      cost: calculateCost({ model: params.model, tokens: response.usage }),
    };

    return modelResponse;
  }

  /** Clone the model and merge/orverride the given properties. */
  extend(args?: PartialCompletionModelArgs): this {
    return new CompletionModel({
      cacheKey: this.cacheKey,
      cache: this.cache,
      client: this.client,
      debug: this.debug,
      ...args,
      context: deepMerge(this.context, args?.context),
      params: deepMerge(this.params, args?.params),
      events: mergeEvents(this.events, args?.events),
    }) as unknown as this;
  }
}
