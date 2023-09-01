import ky from 'ky';
import pThrottle from 'p-throttle';
import pMap from 'p-map';
import type {
  Ctx,
  ISparseModel,
  Prettify,
  SparseConfig,
  SparseResponse,
  SparseRun,
  SparseValues,
} from '../types.js';
import type { ModelArgs } from '../model.js';
import { AbstractModel } from '../model.js';

const SPLADE_MODELS = ['naver/splade-cocondenser-ensembledistil'] as const;
type SpladeModelName = (typeof SPLADE_MODELS)[number];

interface CSparseConfig extends SparseConfig {
  model: SpladeModelName;
}

export type ISpladeModel = ISparseModel<
  CSparseConfig,
  SparseRun,
  SparseResponse
>;

interface CMultiSparseConfig extends CSparseConfig {
  concurrency?: number;
  throttleLimit?: number;
  throttleInterval?: number;
}

export class SpladeModel
  extends AbstractModel<CMultiSparseConfig, SparseRun, SparseResponse>
  implements ISpladeModel
{
  modelType = 'sparse-vector' as const;
  modelProvider = 'custom' as const;
  serviceUrl: string;

  constructor(
    args: Prettify<
      ModelArgs<CMultiSparseConfig, SparseRun, SparseResponse> & {
        serviceUrl?: string;
      }
    >
  ) {
    const { serviceUrl, ...rest } = args;
    super(rest);
    const tempServiceUrl = serviceUrl || process.env['SPLADE_SERVICE_URL'];
    if (!tempServiceUrl) {
      throw new Error('Missing process.env.SPLADE_SERVICE_URL');
    }
    this.serviceUrl = tempServiceUrl;
  }

  protected async runModel(
    params: SparseRun & CMultiSparseConfig,
    context: Ctx
  ): Promise<SparseResponse> {
    const interval = params.throttleInterval ?? 1000 * 60; // 1 minute
    const limit = params.throttleLimit ?? 600;
    const concurrency = params.concurrency ?? 10;

    // Create a throttled version of the function for a single request
    const throttled = pThrottle({ limit, interval })(
      async (params: { input: string; model: SpladeModelName }) =>
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
    };
  }

  protected async runSingle(
    params: { input: string } & CSparseConfig,
    context: Ctx
  ) {
    const start = Date.now();
    const vector = await createSpladeVector(params, this.serviceUrl);
    const latency = Date.now() - start;

    // Don't need tokens for this model
    const tokens = { prompt: 0, completion: 0, total: 0 } as const;
    await this.hooks.afterApiResponse?.({
      timestamp: new Date().toISOString(),
      modelType: this.modelType,
      modelProvider: this.modelProvider,
      // @ts-ignore
      params,
      response: vector,
      tokens,
      context,
      latency,
    });
    return { vector, tokens };
  }
}

async function createSpladeVector(
  params: {
    input: string;
    model: SpladeModelName;
  },
  serviceUrl: string
): Promise<SparseValues> {
  try {
    const sparseValues = await ky
      .post(serviceUrl, {
        timeout: 1000 * 60,
        json: { text: params.input },
      })
      .json<SparseValues>();
    return sparseValues;
  } catch (e) {
    // @ts-ignore: TODO: add custom Error class that handles this
    throw new Error('Failed to create splade vector', { cause: e });
  }
}
