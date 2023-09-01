import pThrottle from 'p-throttle';
import pRetry, { AbortError } from 'p-retry';
import pMap from 'p-map';
import type {
  EmbeddingConfig,
  Ctx,
  EmbeddingRun,
  EmbeddingResponse,
  IEmbeddingModel,
  ITokenizer,
  TokenCounts,
  Prettify,
} from '../types.js';
import type { ModelArgs } from '../model.js';
import { AbstractModel } from '../model.js';
import { OpenAIApiError, createOpenAIClient, extractTokens } from './client.js';
import type {
  OpenAIClient,
  OpenAIEmbeddingModel,
  OpenAIEmbeddingParams,
  OpenAIEmbeddingResponse,
} from './client.js';
import { createTokenizer } from './tokenizer.js';

interface BatchOptions {
  maxTokensPerBatch: number;
  maxBatchSize: number;
}
interface ThrottleOptions {
  maxRequestsPerMin: number;
  maxConcurrentRequests: number;
}
interface RetryOptions {
  maxRetries: number;
  jitter: number;
  initialDelay: number;
  exponentialBase: number;
}
export interface OEmbeddingConfig
  extends EmbeddingConfig,
    Omit<OpenAIEmbeddingParams, 'input' | 'user'> {
  model: OpenAIEmbeddingModel;
  batch?: Partial<BatchOptions>;
  throttle?: Partial<ThrottleOptions>;
  retry?: Partial<RetryOptions>;
}

export type IOEmbeddingModel = IEmbeddingModel<
  OEmbeddingConfig,
  EmbeddingRun,
  EmbeddingResponse
>;

type BulkEmbedder = (
  params: EmbeddingRun & OEmbeddingConfig,
  context: Ctx
) => Promise<EmbeddingResponse>;

const DEFAULTS = {
  /** The interval that the OpenAI API rate limit resets */
  throttleInterval: 1000 * 60, // 1 minute
  maxBatchSize: 10,
  maxTokensPerBatch: 20000,
  maxConcurrentRequests: 1,
  maxRequestsPerMin: 3500,
  maxRetries: 3,
  jitter: 0.3,
  initialDelay: 1000,
  exponentialBase: 3,
} as const;

export class OEmbeddingModel
  extends AbstractModel<
    OEmbeddingConfig,
    EmbeddingRun,
    EmbeddingResponse,
    OpenAIEmbeddingResponse
  >
  implements IOEmbeddingModel
{
  modelType = 'embedding' as const;
  modelProvider = 'openai' as const;
  openaiClient: OpenAIClient;
  throttledModel: BulkEmbedder;
  tokenizer: ITokenizer;

  /** Doesn't accept OpenAIClient because retry needs to be handled at the model level. */
  constructor(
    args: Prettify<
      ModelArgs<OEmbeddingConfig, EmbeddingRun, EmbeddingResponse> & {
        openaiClient?: OpenAIClient;
      }
    >
  ) {
    const { openaiClient, params, ...rest } = args;
    super({ params, ...rest });
    this.openaiClient = openaiClient || createOpenAIClient();
    this.tokenizer = createTokenizer(params.model);
    const interval = DEFAULTS.throttleInterval;
    const limit =
      this.params.throttle?.maxRequestsPerMin || DEFAULTS.maxRequestsPerMin;
    // Create the throttled function
    this.throttledModel = pThrottle({ limit, interval })(
      async (params: EmbeddingRun & OEmbeddingConfig, context: Ctx) => {
        try {
          const start = Date.now();
          // Make the request to OpenAI API to generate embeddings
          const { embeddings, response } =
            await this.openaiClient.createEmbeddings({
              model: params.model,
              input: params.input,
            });
          const latency = Date.now() - start;
          const tokens = extractTokens(response.usage);
          await this.hooks.afterApiResponse?.({
            timestamp: new Date().toISOString(),
            modelType: this.modelType,
            modelProvider: this.modelProvider,
            params,
            response,
            tokens,
            context,
            latency,
          });
          return { embeddings, tokens };
        } catch (error) {
          const codesToRetry = [408, 413, 429, 500, 502, 503, 504];
          if (
            error instanceof OpenAIApiError &&
            error.status &&
            codesToRetry.includes(error.status)
          ) {
            // If rate limit error, throw an error that can be retried
            throw error;
          }
          // Otherwise, throw an error that will not be retried
          throw new AbortError(error as Error);
        }
      }
    );
  }

  async runModel(
    params: EmbeddingRun,
    context: Ctx
  ): Promise<EmbeddingResponse> {
    // Batch the inputs for the requests
    const batches = batchInputs({
      input: params.input,
      tokenizer: this.tokenizer,
      options: this.params.batch,
    }).map((batch) => batch.map((input) => input.text));

    const mergedContext = { ...this.context, ...context } as Ctx;

    // Make the requests in parallel, respecting concurrency setting
    const embeddingBatches = await pMap(
      batches,
      async (batch: string[]) => {
        return pRetry<EmbeddingResponse>(
          async () => {
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
            retries: this.params.retry?.maxRetries || DEFAULTS.maxRetries,
            onFailedAttempt: async (error) => {
              const delay: number = getBackoffTime({
                attemptNumber: error.attemptNumber,
                ...this.params.retry,
              });
              await new Promise((resolve) => setTimeout(resolve, delay));
            },
          }
        );
      },
      {
        concurrency:
          this.params.throttle?.maxConcurrentRequests ||
          DEFAULTS.maxConcurrentRequests,
      }
    );

    // Flatten the batches of embeddings into a single array
    const embeddings = embeddingBatches.map((batch) => batch.embeddings).flat();
    const tokens = embeddingBatches
      .map((batch) => batch.tokens)
      .reduce((acc, curr) => {
        return {
          total: acc.total + curr.total,
          prompt: acc.prompt + curr.prompt,
          completion: 0,
        };
      }, {} as TokenCounts);

    return { embeddings, tokens };
  }
}

/**
 * Get the time in milliseconds to wait before making another request after an error.
 * Use an exponential backoff strategy with a random jitter.
 * Adapted from: https://platform.openai.com/docs/guides/rate-limits/retrying-with-exponential-backoff
 */
function getBackoffTime(
  args: { attemptNumber: number } & Partial<RetryOptions>
): number {
  const {
    exponentialBase = DEFAULTS.exponentialBase,
    initialDelay = DEFAULTS.initialDelay,
    jitter = DEFAULTS.jitter,
  } = args;

  // Calculate the delay based on exponential backoff strategy
  const delay = initialDelay * exponentialBase ** (args.attemptNumber - 1);

  // Calculate the random jitter (randomness within a certain range to avoid simultaneous retries)
  const randomJitter = delay * jitter * numberBetween(-1, 1);

  // The final backoff time includes the jitter
  const backoffTime = delay + randomJitter;

  return backoffTime;
}

/** Get a random number between the specified range [min, max]. */
function numberBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

type InputBatch = { text: string; tokenCount: number }[];

/**
 * Split text inputs into batches, respecting token limits and batch size.
 * @throws {Error} If an input exceeds the max tokens per batch.
 */
function batchInputs(args: {
  input: string[];
  tokenizer: ITokenizer;
  options?: Partial<BatchOptions>;
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
