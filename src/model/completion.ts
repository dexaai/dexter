import { type PartialDeep, type SetOptional } from 'type-fest';

import { createOpenAIClient } from './clients/openai.js';
import { AbstractModel, type ModelArgs } from './model.js';
import { type Model } from './types.js';
import { calculateCost } from './utils/calculate-cost.js';
import { deepMerge, mergeEvents, type Prettify } from './utils/helpers.js';

export type CompletionModelArgs<
  CustomCtx extends Model.Ctx,
  CustomClient extends Model.Completion.Client,
  CustomConfig extends Model.Completion.Config<CustomClient>,
> = SetOptional<
  ModelArgs<
    CustomClient,
    CustomConfig,
    Model.Completion.Run,
    Model.Completion.Response,
    CustomCtx
  >,
  'client' | 'params'
>;

export type PartialCompletionModelArgs<
  CustomCtx extends Model.Ctx,
  CustomClient extends Model.Completion.Client,
  CustomConfig extends Model.Completion.Config<CustomClient>,
> = Prettify<
  PartialDeep<
    Pick<
      CompletionModelArgs<Partial<CustomCtx>, CustomClient, CustomConfig>,
      'params'
    >
  > &
    Partial<
      Omit<
        CompletionModelArgs<Partial<CustomCtx>, CustomClient, CustomConfig>,
        'params'
      >
    >
>;

export class CompletionModel<
  CustomCtx extends Model.Ctx = Model.Ctx,
  CustomClient extends Model.Completion.Client = Model.Completion.Client,
  CustomConfig extends
    Model.Completion.Config<CustomClient> = Model.Completion.Config<CustomClient>,
> extends AbstractModel<
  CustomClient,
  CustomConfig,
  Model.Completion.Run,
  Model.Completion.Response,
  Model.Completion.ApiResponse,
  CustomCtx
> {
  modelType = 'completion' as const;
  modelProvider = 'openai' as const;

  constructor(
    args?: CompletionModelArgs<CustomCtx, CustomClient, CustomConfig>
  ) {
    let { client, params } = args ?? {};
    const { client: _, params: __, ...rest } = args ?? {};
    // Add a default client if none is provided
    client = (client ?? createOpenAIClient()) as CustomClient;
    // Set default model if no params are provided
    params =
      params ??
      ({ model: 'gpt-3.5-turbo-instruct' } as CustomConfig &
        Partial<Model.Completion.Run>);
    super({ client, params, ...rest });
  }

  protected async runModel(
    {
      requestOpts,
      ...params
    }: Partial<Model.Completion.Run & Model.Completion.Config<CustomClient>>,
    context: CustomCtx
  ): Promise<Model.Completion.Response> {
    const start = Date.now();

    const allParams = {
      ...this.params,
      ...params,
      prompt: params.prompt ?? this.params.prompt ?? null,
    };

    // Make the OpenAI API request
    const response = await this.client.createCompletions(
      allParams,
      requestOpts
    );

    await Promise.allSettled(
      this.events?.onApiResponse?.map((event) =>
        Promise.resolve(
          event({
            timestamp: new Date().toISOString(),
            modelType: this.modelType,
            modelProvider: this.modelProvider,
            params: allParams,
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
      cost: calculateCost({ model: allParams.model, tokens: response.usage }),
    };

    return modelResponse;
  }

  /** Clone the model and merge/override the given properties. */
  extend(
    args?: PartialCompletionModelArgs<CustomCtx, CustomClient, CustomConfig>
  ): this {
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
