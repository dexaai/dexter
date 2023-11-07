import pThrottle from 'p-throttle';
import pMap from 'p-map';
import type { ModelArgs } from './model.js';
import { AbstractModel } from './model.js';
import type { Model } from './types.js';
import { createSpladeClient } from './clients/splade.js';
import type { Prettify } from '../utils/helpers.js';

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

  /** Clone the model and merge/orverride the given properties. */
  clone(args?: SparseVectorModelArgs): this {
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
