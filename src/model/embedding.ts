import pMap from 'p-map';
import pThrottle from 'p-throttle';
import { type PartialDeep, type SetOptional } from 'type-fest';

import { createOpenAIClient } from './clients/openai.js';
import { AbstractModel, type ModelArgs } from './model.js';
import { type Model } from './types.js';
import { calculateCost } from './utils/calculate-cost.js';
import { deepMerge, mergeEvents, type Prettify } from './utils/helpers.js';

export type EmbeddingModelArgs<
  CustomCtx extends Model.Ctx,
  CustomClient extends Model.Embedding.Client = Model.Embedding.Client,
  CustomConfig extends
    Model.Embedding.Config<CustomClient> = Model.Embedding.Config<CustomClient>,
> = SetOptional<
  ModelArgs<
    CustomClient,
    CustomConfig,
    Model.Embedding.Run,
    Model.Embedding.Response,
    CustomCtx
  >,
  'client' | 'params'
>;

export type PartialEmbeddingModelArgs<
  CustomCtx extends Model.Ctx,
  CustomClient extends Model.Embedding.Client = Model.Embedding.Client,
  CustomConfig extends
    Model.Embedding.Config<CustomClient> = Model.Embedding.Config<CustomClient>,
> = Prettify<
  PartialDeep<
    Pick<
      EmbeddingModelArgs<Partial<CustomCtx>, CustomClient, CustomConfig>,
      'params'
    >
  > &
    Partial<
      Omit<
        EmbeddingModelArgs<Partial<CustomCtx>, CustomClient, CustomConfig>,
        'params'
      >
    >
>;

type BulkEmbedder<
  CustomCtx extends Model.Ctx,
  CustomClient extends Model.Embedding.Client = Model.Embedding.Client,
  CustomConfig extends
    Model.Embedding.Config<CustomClient> = Model.Embedding.Config<CustomClient>,
> = (
  params: Model.Embedding.Run & CustomConfig,
  context: CustomCtx
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

export class EmbeddingModel<
  CustomCtx extends Model.Ctx = Model.Ctx,
  CustomClient extends Model.Embedding.Client = Model.Embedding.Client,
  CustomConfig extends
    Model.Embedding.Config<CustomClient> = Model.Embedding.Config<CustomClient>,
> extends AbstractModel<
  CustomClient,
  CustomConfig,
  Model.Embedding.Run,
  Model.Embedding.Response,
  Model.Embedding.ApiResponse,
  CustomCtx
> {
  modelType = 'embedding' as const;
  modelProvider = 'openai' as const;
  throttledModel: BulkEmbedder<CustomCtx, CustomClient, CustomConfig>;

  constructor(
    args: EmbeddingModelArgs<CustomCtx, CustomClient, CustomConfig> = {}
  ) {
    const {
      client = createOpenAIClient(),
      params = { model: DEFAULTS.model },
      ...rest
    } = args;
    super({
      client: client as CustomClient,
      params: params as CustomConfig,
      ...rest,
    });

    const interval = DEFAULTS.throttleInterval;
    const limit =
      this.params.throttle?.maxRequestsPerMin || DEFAULTS.maxRequestsPerMin;

    // Create the throttled function
    this.throttledModel = pThrottle({ limit, interval })(
      async (
        params: Model.Embedding.Run & Model.Embedding.Config<CustomClient>,
        context: CustomCtx
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
                params: params as Model.Embedding.Run & CustomConfig,
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

        if (modelResponse.embeddings.length !== params.input.length) {
          throw new Error(
            'Number of embeddings does not match number of inputs.'
          );
        }

        return modelResponse;
      }
    ) as BulkEmbedder<
      CustomCtx,
      CustomClient,
      Model.Embedding.Config<CustomClient>
    >;
  }

  protected async runModel(
    {
      requestOpts,
      ...params
    }: Model.Embedding.Run & Partial<Model.Embedding.Config<CustomClient>>,
    context: CustomCtx
  ): Promise<Model.Embedding.Response> {
    const start = Date.now();

    const allParams = {
      ...this.params,
      ...params,
      input: params.input ?? this.params.input ?? [],
    };

    // Batch the inputs for the requests
    const batches = batchInputs({
      input: allParams.input,
      tokenizer: this.tokenizer,
      options: this.params.batch,
    });

    const mergedContext = deepMerge(this.context, context);

    // Make the requests in parallel, respecting concurrency setting
    const embeddingBatches = await pMap(
      batches.map((batch) => batch.map((input) => input.text)),
      async (batch: string[]) => {
        const response = await this.throttledModel(
          {
            input: batch,
            model: this.params.model,
            requestOpts,
          } as Model.Embedding.Run & CustomConfig,
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
      embeddings: embeddingBatches.map((batch) => batch.embeddings).flat(),
      cached: false,
      cost: calculateCost({ model: allParams.model, tokens: usage }),
      latency: Date.now() - start,
    };

    return modelResponse;
  }

  /** Clone the model and merge/override the given properties. */
  extend(
    args?: PartialEmbeddingModelArgs<CustomCtx, CustomClient, CustomConfig>
  ): this {
    return new EmbeddingModel<CustomCtx, CustomClient, CustomConfig>({
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

  for (const input of inputs) {
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
