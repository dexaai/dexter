import type {
  ChatParams,
  ChatResponse,
  ChatStreamResponse,
  CompletionParams,
  CompletionResponse,
  EmbeddingParams,
  EmbeddingResponse,
  OpenAIClient,
} from 'openai-fetch';
import type { Model } from '../types.js';

type InnerType<T> = T extends ReadableStream<infer U> ? U : never;

export namespace OpenAI {
  export type Client = OpenAIClient;

  /** OpenAI chat completion endpoint. */
  export namespace Chat {
    /** Model parameters passed to the OpenAI API. */
    export type Params = {
      messages: ChatParams['messages'];
      model: ChatParams['model'];
      frequency_penalty?: ChatParams['frequency_penalty'];
      function_call?: ChatParams['function_call'];
      functions?: ChatParams['functions'];
      logit_bias?: ChatParams['logit_bias'];
      max_tokens?: ChatParams['max_tokens'];
      presence_penalty?: ChatParams['presence_penalty'];
      stop?: ChatParams['stop'];
      temperature?: ChatParams['temperature'];
      top_p?: ChatParams['top_p'];
    };
    /** Response from the OpenAI API. */
    export type Response = ChatResponse;
    /** Streaming response from the OpenAI API. */
    export type StreamResponse = ChatStreamResponse;
    /** A chunk recieved from a streaming response */
    export type CompletionChunk = InnerType<StreamResponse>;
    /** ChatModel class config */
    export interface Config
      extends Model.Chat.Config,
        Omit<Params, 'messages' | 'user'> {
      model: Params['model'];
    }
  }

  /** OpenAI text embedding endpoint. */
  export namespace Embedding {
    /** Model parameters passed to the OpenAI API. */
    export type Params = EmbeddingParams;
    /** Response from the OpenAI API. */
    export type Response = EmbeddingResponse;
    /** API request batching options */
    export interface BatchOptions {
      maxTokensPerBatch: number;
      maxBatchSize: number;
    }
    /** API request throttling options */
    interface ThrottleOptions {
      maxRequestsPerMin: number;
      maxConcurrentRequests: number;
    }
    /** Completion Model class config */
    export interface Config
      extends Model.Embedding.Config,
        Omit<Params, 'input' | 'user'> {
      model: Params['model'];
      batch?: Partial<BatchOptions>;
      throttle?: Partial<ThrottleOptions>;
    }
  }

  /** OpenAI (legacy) text completion endpoint. */
  export namespace Completion {
    /** Model parameters passed to the OpenAI API. */
    export type Params = CompletionParams;
    /** Response from the OpenAI API. */
    export type Response = CompletionResponse;
    /** CompletionModel class config */
    export interface Config
      extends Model.Completion.Config,
        Omit<Params, 'prompt' | 'user'> {
      model: Params['model'];
    }
  }
}
