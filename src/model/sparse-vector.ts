import type { PartialDeep } from 'type-fest';
import pThrottle from 'p-throttle';
import pMap from 'p-map';
import type { ModelArgs } from './model.js';
import { AbstractModel } from './model.js';
import type { Model } from './types.js';
import { createSpladeClient } from './clients/splade.js';
import { deepMerge, mergeEvents, type Prettify } from '../utils/helpers.js';

export type SparseVectorModelArgs = Prettify<
  Omit<
    ModelArgs<
      Model.SparseVector.Client,
      Model.SparseVector.Config,
      Model.SparseVector.Run,
      Model.SparseVector.Response
    >,
    'client'
  > & {
    serviceUrl?: string;
  }
>;

export type PartialSparseVectorModelArgs = Prettify<
  PartialDeep<Pick<SparseVectorModelArgs, 'params'>> &
    Partial<Omit<SparseVectorModelArgs, 'params'>>
>;

export class SparseVectorModel extends AbstractModel<
  Model.SparseVector.Client,
  Model.SparseVector.Config,
  Model.SparseVector.Run,
  Model.SparseVector.Response
> {
  modelType = 'sparse-vector' as const;
  modelProvider = 'custom' as const;
  serviceUrl: string;

  constructor(args: SparseVectorModelArgs) {
    const { serviceUrl, ...rest } = args;
    super({ client: createSpladeClient(), ...rest });
    const safeProcess = globalThis.process || { env: {} };
    const tempServiceUrl = serviceUrl || safeProcess.env['SPLADE_SERVICE_URL'];
    if (!tempServiceUrl) {
      throw new Error('Missing process.env.SPLADE_SERVICE_URL');
    }
    this.serviceUrl = tempServiceUrl;
  }

  protected async runModel(
    params: Model.SparseVector.Run & Model.SparseVector.Config,
    context: Model.Ctx
  ): Promise<Model.SparseVector.Response> {
    const start = Date.now();
    const interval = params.throttleInterval ?? 1000 * 60; // 1 minute
    const limit = params.throttleLimit ?? 600;
    const concurrency = params.concurrency ?? 10;

    // Create a throttled version of the function for a single request
    const throttled = pThrottle({ limit, interval })(
      async (params: { input: string; model: string }) =>
        this.runSingle(params, context)
    );

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

  protected async runSingle(
    params: { input: string; model: string },
    context: Model.Ctx
  ) {
    const start = Date.now();
    const vector = await this.client.createSparseVector(
      params,
      this.serviceUrl
    );
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
  extend(args?: PartialSparseVectorModelArgs): this {
    return new SparseVectorModel({
      cacheKey: this.cacheKey,
      cache: this.cache,
      debug: this.debug,
      serviceUrl: this.serviceUrl,
      ...args,
      context: deepMerge(this.context, args?.context),
      params: deepMerge(this.params, args?.params),
      events: mergeEvents(this.events, args?.events),
    }) as unknown as this;
  }
}
