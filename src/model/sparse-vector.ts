import { type Options as KYOptions } from 'ky';
import pMap from 'p-map';
import pThrottle from 'p-throttle';
import { type PartialDeep } from 'type-fest';

import { createSpladeClient } from './clients/splade.js';
import { AbstractModel, type ModelArgs } from './model.js';
import { type Model } from './types.js';
import { deepMerge, mergeEvents, type Prettify } from './utils/helpers.js';

export type SparseVectorModelArgs<
  CustomCtx extends Model.Ctx,
  CustomClient extends Model.SparseVector.Client = Model.SparseVector.Client,
  CustomConfig extends
    Model.SparseVector.Config<CustomClient> = Model.SparseVector.Config<CustomClient>,
> = Prettify<
  Omit<
    ModelArgs<
      CustomClient,
      CustomConfig,
      Model.SparseVector.Run,
      Model.SparseVector.Response,
      CustomCtx
    >,
    'client'
  > & {
    serviceUrl?: string;
  }
>;

export type PartialSparseVectorModelArgs<
  CustomCtx extends Model.Ctx,
  CustomClient extends Model.SparseVector.Client = Model.SparseVector.Client,
  CustomConfig extends
    Model.SparseVector.Config<CustomClient> = Model.SparseVector.Config<CustomClient>,
> = Prettify<
  PartialDeep<
    Pick<
      SparseVectorModelArgs<Partial<CustomCtx>, CustomClient, CustomConfig>,
      'params'
    >
  > &
    Partial<
      Omit<
        SparseVectorModelArgs<Partial<CustomCtx>, CustomClient, CustomConfig>,
        'params'
      >
    >
>;

export class SparseVectorModel<
  CustomCtx extends Model.Ctx = Model.Ctx,
  CustomClient extends Model.SparseVector.Client = Model.SparseVector.Client,
  CustomConfig extends
    Model.SparseVector.Config<CustomClient> = Model.SparseVector.Config<CustomClient>,
> extends AbstractModel<
  CustomClient,
  CustomConfig,
  Model.SparseVector.Run,
  Model.SparseVector.Response,
  Model.SparseVector.ApiResponse,
  CustomCtx
> {
  modelType = 'sparse-vector' as const;
  modelProvider = 'custom' as const;
  serviceUrl: string;

  constructor(
    args: SparseVectorModelArgs<CustomCtx, CustomClient, CustomConfig>
  ) {
    const { serviceUrl, ...rest } = args;
    super({ client: createSpladeClient() as CustomClient, ...rest });
    const safeProcess = globalThis.process || { env: {} };
    const tempServiceUrl = serviceUrl || safeProcess.env.SPLADE_SERVICE_URL;
    if (!tempServiceUrl) {
      throw new Error('Missing process.env.SPLADE_SERVICE_URL');
    }
    this.serviceUrl = tempServiceUrl;
  }

  protected async runModel(
    {
      requestOpts: _,
      ...params
    }: Model.SparseVector.Run &
      Partial<Model.SparseVector.Config<CustomClient>>,
    context: CustomCtx
  ): Promise<Model.SparseVector.Response> {
    const start = Date.now();
    const interval = params.throttleInterval ?? 1000 * 60; // 1 minute
    const limit = params.throttleLimit ?? 600;
    const concurrency = params.concurrency ?? 10;

    const model = params.model ?? this.params.model;
    const input = params.input ?? this.params.input ?? [];

    // Create a throttled version of the function for a single request
    const throttled = pThrottle({ limit, interval })(
      async (params: { input: string; model: CustomConfig['model'] }) =>
        this.runSingle(params, context)
    );

    // Run the requests in parallel, respecting the maxConcurrentRequests value
    const inputs = input.map((input) => ({
      input,
      model,
    }));
    const responses = await pMap(inputs, throttled, { concurrency });

    return {
      vectors: responses.map((r) => r.vector),
      cached: false,
      latency: Date.now() - start,
    };
  }

  protected async runSingle(
    params: {
      input: string;
      model: CustomConfig['model'];
      requestOpts?: {
        headers?: KYOptions['headers'];
      };
    },
    context: CustomCtx
  ): Promise<{
    vector: Model.SparseVector.Vector;
    tokens: {
      prompt: number;
      completion: number;
      total: number;
    };
  }> {
    const start = Date.now();
    const vector: Model.SparseVector.Vector =
      await this.client.createSparseVector(params, this.serviceUrl);
    const latency = Date.now() - start;

    // Don't need tokens for this model
    const tokens = { prompt: 0, completion: 0, total: 0 } as const;
    const { input, model } = params;

    await Promise.allSettled(
      this.events?.onApiResponse?.map((event) =>
        Promise.resolve(
          event({
            timestamp: new Date().toISOString(),
            modelType: this.modelType,
            modelProvider: this.modelProvider,
            params: { input: [input], model },
            response: vector,
            latency,
            context,
          })
        )
      ) ?? []
    );

    return { vector, tokens };
  }

  /** Clone the model and merge/override the given properties. */
  extend(
    args?: PartialSparseVectorModelArgs<CustomCtx, CustomClient, CustomConfig>
  ): this {
    return new SparseVectorModel({
      cacheKey: this.cacheKey,
      cache: this.cache,
      debug: this.debug,
      telemetry: this.telemetry,
      serviceUrl: this.serviceUrl,
      ...args,
      context: deepMerge(this.context, args?.context),
      params: deepMerge(this.params, args?.params),
      events: mergeEvents(this.events, args?.events),
    }) as unknown as this;
  }
}
