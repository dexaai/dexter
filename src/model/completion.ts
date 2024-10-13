import { type PartialDeep, type SetOptional } from 'type-fest';

import { createOpenAIClient } from './clients/openai.js';
import { AbstractModel, type ModelArgs } from './model.js';
import { type Model } from './types.js';
import { calculateCost } from './utils/calculate-cost.js';
import { deepMerge, mergeEvents, type Prettify } from './utils/helpers.js';

export type CompletionModelArgs<CustomCtx extends Model.Ctx> = SetOptional<
  ModelArgs<
    Model.Completion.Client,
    Model.Completion.Config,
    Model.Completion.Run,
    Model.Completion.Response,
    CustomCtx
  >,
  'client' | 'params'
>;

export type PartialCompletionModelArgs<CustomCtx extends Model.Ctx> = Prettify<
  PartialDeep<Pick<CompletionModelArgs<Partial<CustomCtx>>, 'params'>> &
    Partial<Omit<CompletionModelArgs<Partial<CustomCtx>>, 'params'>>
>;

export class CompletionModel<
  CustomCtx extends Model.Ctx = Model.Ctx,
> extends AbstractModel<
  Model.Completion.Client,
  Model.Completion.Config,
  Model.Completion.Run,
  Model.Completion.Response,
  Model.Completion.ApiResponse,
  CustomCtx
> {
  modelType = 'completion' as const;
  modelProvider = 'openai' as const;

  constructor(args?: CompletionModelArgs<CustomCtx>) {
    let { client, params } = args ?? {};
    const { client: _, params: __, ...rest } = args ?? {};
    // Add a default client if none is provided
    client = client ?? createOpenAIClient();
    // Set default model if no params are provided
    params = params ?? { model: 'gpt-3.5-turbo-instruct' };
    super({ client, params, ...rest });
  }

  protected async runModel(
    { requestOpts, ...params }: Model.Completion.Run & Model.Completion.Config,
    context: CustomCtx
  ): Promise<Model.Completion.Response> {
    const start = Date.now();

    // Make the OpenAI API request
    const response = await this.client.createCompletions(params, requestOpts);

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

  /** Clone the model and merge/override the given properties. */
  extend(args?: PartialCompletionModelArgs<CustomCtx>): this {
    return new CompletionModel({
      cacheKey: this.cacheKey,
      cache: this.cache,
      client: this.client,
      debug: this.debug,
      telemetry: this.telemetry,
      ...args,
      context: deepMerge(this.context, args?.context),
      params: deepMerge(this.params, args?.params),
      events: mergeEvents(this.events, args?.events),
    }) as unknown as this;
  }
}
