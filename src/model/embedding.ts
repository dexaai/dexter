import pThrottle from 'p-throttle';
import pMap from 'p-map';
import type { SetOptional } from 'type-fest';
import type { ModelArgs } from './model.js';
import type { Model } from './types.js';
import { calculateCost } from './utils/calculate-cost.js';
import { createOpenAIClient } from './clients/openai.js';
import { AbstractModel } from './model.js';
import { deepMerge } from './utils/helpers.js';

export type EmbeddingModelArgs = SetOptional<
  ModelArgs<
    Model.Embedding.Client,
    Model.Embedding.Config,
    Model.Embedding.Run,
    Model.Embedding.Response
  >,
  'client' | 'params'
>;

type BulkEmbedder = (
  params: Model.Embedding.Run & Model.Embedding.Config,
  context: Model.Ctx
) => Promise<Model.Embedding.Response>;

const DEFAULTS = {
  /** The interval that the OpenAI API rate limit resets */
  throttleInterval: 1000 * 60, // 1 minute
  maxBatchSize: 10,
  maxTokensPerBatch: 20000,
  maxConcurrentRequests: 1,
  maxRequestsPerMin: 3500,
  model: 'text-embedding-ada-002',
} as const;

export class EmbeddingModel extends AbstractModel<
  Model.Embedding.Client,
  Model.Embedding.Config,
  Model.Embedding.Run,
  Model.Embedding.Response,
  Model.Embedding.ApiResponse
> {
  modelType = 'embedding' as const;
  modelProvider = 'openai' as const;
  throttledModel: BulkEmbedder;

  /** Doesn't accept OpenAIClient because retry needs to be handled at the model level. */
  constructor(args?: EmbeddingModelArgs) {
    let { client, params, ...rest } = args || {};
    client = client || createOpenAIClient();
    params = params || { model: DEFAULTS.model };
    super({ client, params, ...rest });
    const interval = DEFAULTS.throttleInterval;
    const limit =
      this.params.throttle?.maxRequestsPerMin || DEFAULTS.maxRequestsPerMin;

    // Create the throttled function
    this.throttledModel = pThrottle({ limit, interval })(
      async (
        params: Model.Embedding.Run & Model.Embedding.Config,
        context: Model.Ctx
      ) => {
        const start = Date.now();

        // Make the request to OpenAI API to generate embeddings
        const response = await this.client.createEmbeddings({
          model: params.model,
          input: params.input,
        });

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

        const modelResponse: Model.Embedding.Response = {
          ...response,
          embeddings: response.data.map((item) => item.embedding),
          cached: false,
          cost: calculateCost({ model: params.model, tokens: response.usage }),
        };

        return modelResponse;
      }
    );
  }

  protected async runModel(
    params: Model.Embedding.Run & Model.Embedding.Config,
    context: Model.Ctx
  ): Promise<Model.Embedding.Response> {
    // Batch the inputs for the requests
    const batches = batchInputs({
      input: params.input,
      tokenizer: this.tokenizer,
      options: this.params.batch,
    });

    const mergedContext = deepMerge(this.context, context) as Model.Ctx;

    // Make the requests in parallel, respecting concurrency setting
    const embeddingBatches = await pMap(
      batches.map((batch) => batch.map((input) => input.text)),
      async (batch: string[]) => {
        const response = await this.throttledModel(
          {
            input: batch,
            model: this.params.model,
          },
          mergedContext
        );
        return response;
      },
      {
        concurrency:
          this.params.throttle?.maxConcurrentRequests ||
          DEFAULTS.maxConcurrentRequests,
      }
    );

    // Flatten the batches of embeddings into a single array
    const embeddingsObjs = embeddingBatches.map((batch) => batch.data).flat();

    // Add up the tokens from the batches
    const totalTokens = batches.reduce((acc, curr) => {
      return acc + curr.reduce((acc, curr) => acc + curr.tokenCount, 0);
    }, 0);

    const { data: _, ...firstBatch } = embeddingBatches[0];
    const usage = { prompt_tokens: totalTokens, total_tokens: totalTokens };
    const modelResponse: Model.Embedding.Response = {
      ...firstBatch,
      usage,
      data: embeddingsObjs,
      cached: false,
      cost: calculateCost({ model: params.model, tokens: usage }),
    };

    return modelResponse;
  }

  /** Clone the model and merge/orverride the given properties. */
  clone(args?: EmbeddingModelArgs): this {
    const { cache, client, context, debug, params, events } = args ?? {};
    // @ts-ignore
    return new EmbeddingModel({
      cache: cache ?? this.cache,
      client: client ?? this.client,
      context: this.mergeContext(this.context, context),
      debug: debug ?? this.debug,
      params: this.mergeParams(this.params, params ?? {}),
      events: this.mergeEvents(this.events, events || {}),
    });
  }
}

type InputBatch = { text: string; tokenCount: number }[];

/**
 * Split text inputs into batches, respecting token limits and batch size.
 * @throws {Error} If an input exceeds the max tokens per batch.
 */
function batchInputs(args: {
  input: string[];
  tokenizer: Model.ITokenizer;
  options?: Partial<Model.Embedding.BatchOptions>;
}): InputBatch[] {
  const { input: inputs, tokenizer, options } = args;
  const {
    maxTokensPerBatch = DEFAULTS.maxTokensPerBatch,
    maxBatchSize = DEFAULTS.maxBatchSize,
  } = options || {};

  // State for constructing batches
  const batches: InputBatch[] = [];
  let currentBatch: InputBatch = [];
  let currentBatchTokens = 0;

  for (let input of inputs) {
    const tokenCount = tokenizer.countTokens(input);

    // Ensure that the input does not exceed the max tokens per batch
    if (tokenCount > maxTokensPerBatch) {
      throw new Error(
        `Input exceeds max tokens per batch: ${tokenCount} > ${maxTokensPerBatch}`
      );
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
