import pThrottle from 'p-throttle';
import pMap from 'p-map';
import type { ModelArgs } from '../model.js';
import { AbstractModel } from '../model.js';
import type { Model } from '../types2.js';
import type { SpladeClient } from './client.js';
import { createSpladeVector } from './client.js';
import type { SparseVector } from './types.js';
import type { Prettify } from '../utils/helpers.js';

export type ISpladeModel = SparseVector.IModel<
  SparseVector.Config,
  SparseVector.Run,
  SparseVector.Response
>;

export class SpladeModel
  extends AbstractModel<
    SpladeClient,
    SparseVector.Config,
    SparseVector.Run,
    SparseVector.Response
  >
  implements ISpladeModel
{
  modelType = 'sparse-vector' as const;
  modelProvider = 'custom' as const;
  serviceUrl: string;

  constructor(
    args: Prettify<
      ModelArgs<
        SpladeClient,
        SparseVector.Config,
        SparseVector.Run,
        SparseVector.Response
      > & {
        serviceUrl?: string;
      }
    >
  ) {
    const { serviceUrl, ...rest } = args;
    super(rest);
    const safeProcess = globalThis.process || { env: {} };
    const tempServiceUrl = serviceUrl || safeProcess.env['SPLADE_SERVICE_URL'];
    if (!tempServiceUrl) {
      throw new Error('Missing process.env.SPLADE_SERVICE_URL');
    }
    this.serviceUrl = tempServiceUrl;
  }

  protected async runModel(
    params: SparseVector.Run & SparseVector.Config,
    context: Model.Ctx
  ): Promise<SparseVector.Response> {
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
      tokens: { prompt: 0, completion: 0, total: 0 },
      cached: false,
    };
  }

  protected async runSingle(
    params: { input: string; model: string },
    context: Model.Ctx
  ) {
    const start = Date.now();
    const vector = await createSpladeVector(params, this.serviceUrl);
    const latency = Date.now() - start;

    // Don't need tokens for this model
    const tokens = { prompt: 0, completion: 0, total: 0 } as const;
    const { input, model } = params;
    this.hooks?.onApiResponse?.forEach((hook) =>
      hook({
        timestamp: new Date().toISOString(),
        modelType: this.modelType,
        modelProvider: this.modelProvider,
        params: { input: [input], model },
        response: vector,
        latency,
        context,
      })
    );

    return { vector, tokens };
  }
}
