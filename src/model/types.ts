/* eslint-disable no-use-before-define */
import { type Options as KYOptions } from 'ky';
import {
  type ChatMessage,
  type ChatParams,
  type ChatResponse,
  type ChatStreamResponse,
  type CompletionParams,
  type CompletionResponse,
  type EmbeddingParams,
  type EmbeddingResponse,
  type OpenAIClient,
} from 'openai-fetch';

import { type ChatModel } from './chat.js';
import { type CompletionModel } from './completion.js';
import { type EmbeddingModel } from './embedding.js';
import { type AbstractModel } from './model.js';
import { type SparseVectorModel } from './sparse-vector.js';

type InnerType<T> = T extends ReadableStream<infer U> ? U : never;

/**
 * Generic Model extended by provider specific implementations.
 */
export namespace Model {
  /**
   * Base model
   */
  export namespace Base {
    /** Client for making API calls. Extended by specific model clients. */
    export type Client = any;
    export interface Config {
      model: string;
    }
    export interface Run {
      [key: string]: any;
      requestOpts?: {
        signal?: AbortSignal;
        headers?: KYOptions['headers'];
      };
    }
    export interface Params extends Config, Run {}
    export interface Response {
      cached: boolean;
      latency?: number;
      cost?: number;
    }
    export type Model = AbstractModel<Client, Config, Run, Response, any>;
  }

  /**
   * Chat Model
   */
  export namespace Chat {
    export type Client = {
      createChatCompletion: OpenAIClient['createChatCompletion'];
      streamChatCompletion: OpenAIClient['streamChatCompletion'];
    };
    export interface Run extends Base.Run {
      messages: Model.Message[];
    }
    export interface Config extends Base.Config {
      /** Handle new chunk from streaming requests. */
      handleUpdate?: (chunk: string) => void;
      frequency_penalty?: ChatParams['frequency_penalty'];
      function_call?: ChatParams['function_call'];
      functions?: ChatParams['functions'];
      logit_bias?: ChatParams['logit_bias'];
      max_tokens?: ChatParams['max_tokens'];
      model: ChatParams['model'];
      presence_penalty?: ChatParams['presence_penalty'];
      response_format?: ChatParams['response_format'];
      seed?: ChatParams['seed'];
      stop?: ChatParams['stop'];
      temperature?: ChatParams['temperature'];
      tools?: ChatParams['tools'];
      tool_choice?: ChatParams['tool_choice'];
      top_p?: ChatParams['top_p'];
    }
    export interface Response extends Base.Response, ChatResponse {
      message: ChatMessage;
    }
    /** Streaming response from the OpenAI API. */
    type StreamResponse = ChatStreamResponse;
    /** A chunk recieved from a streaming response */
    export type CompletionChunk = InnerType<StreamResponse>;
    export type ApiResponse = ChatResponse;
    export type Model = ChatModel;
  }

  /**
   * Completion model
   */
  export namespace Completion {
    export type Client = {
      createCompletions: OpenAIClient['createCompletions'];
    };
    export interface Run extends Base.Run {
      prompt: string | string[] | number[] | number[][] | null;
    }
    export interface Config
      extends Base.Config,
        Omit<CompletionParams, 'prompt' | 'user'> {
      model: CompletionParams['model'];
    }
    export interface Response extends Base.Response, CompletionResponse {
      completion: string;
    }
    export type ApiResponse = CompletionResponse;
    export type Model = CompletionModel;
  }

  /** Generic metadata object. */
  export type Ctx = { [key: string]: any };

  /**
   * Embedding Model
   */
  export namespace Embedding {
    export type Client = {
      createEmbeddings: OpenAIClient['createEmbeddings'];
    };
    export interface Run extends Base.Run {
      input: string[];
    }
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
    export interface Config
      extends Base.Config,
        Omit<EmbeddingParams, 'input' | 'user'> {
      model: EmbeddingParams['model'];
      batch?: Partial<BatchOptions>;
      throttle?: Partial<ThrottleOptions>;
    }
    export interface Response extends Base.Response, EmbeddingResponse {
      embeddings: number[][];
    }
    export type ApiResponse = EmbeddingResponse;
    export type Model = EmbeddingModel;
  }

  /**
   * Event handlers for logging and debugging
   */
  export interface Events<
    MParams extends Base.Params,
    MResponse extends Base.Response,
    MCtx extends Model.Ctx,
    AResponse = any,
  > {
    onStart?: ((event: {
      timestamp: string;
      modelType: Type;
      modelProvider: Provider;
      params: Readonly<MParams>;
      context: Readonly<MCtx>;
    }) => void | Promise<void>)[];
    onApiResponse?: ((event: {
      timestamp: string;
      modelType: Type;
      modelProvider: Provider;
      params: Readonly<MParams>;
      response: Readonly<AResponse>;
      latency: number;
      context: Readonly<MCtx>;
    }) => void | Promise<void>)[];
    onComplete?: ((event: {
      timestamp: string;
      modelType: Type;
      modelProvider: Provider;
      params: Readonly<MParams>;
      response: Readonly<MResponse>;
      context: Readonly<MCtx>;
      cached: boolean;
    }) => void | Promise<void>)[];
    onError?: ((event: {
      timestamp: string;
      modelType: Type;
      modelProvider: Provider;
      params: Readonly<MParams>;
      error: unknown;
      context: Readonly<MCtx>;
    }) => void | Promise<void>)[];
  }

  /**
   * Generic interface for a model tokenizer
   */
  export interface ITokenizer {
    /** Tokenize a string into an array of integer tokens */
    encode(text: string): Uint32Array;
    /** Decode an array of integer tokens into a string */
    decode(tokens: number[] | Uint32Array): string;
    /**
     * Count the number of tokens in a string or ChatMessage(s).
     * A single ChatMessage is counted as a completion and an array as a prompt.
     * Strings are counted as is.
     */
    countTokens(input?: string | ChatMessage | ChatMessage[]): number;
    /** Truncate a string to a maximum number of tokens */
    truncate(args: {
      /** Text to truncate */
      text: string;
      /** Maximum number of tokens to keep (inclusive) */
      max: number;
      /** Truncate from the start or end of the text */
      from?: 'start' | 'end';
    }): string;
  }

  /** Primary message type for chat models */
  export type Message = ChatMessage;

  /** The provider of the model (eg: OpenAI) */
  export type Provider = (string & {}) | 'openai' | 'custom';

  /**
   * Sparse vector model (SPLADE)
   */
  export namespace SparseVector {
    export type Client = {
      createSparseVector: (
        params: {
          input: string;
          model: string;
          requestOpts?: {
            headers?: KYOptions['headers'];
          };
        },
        serviceUrl: string
      ) => Promise<SparseVector.Vector>;
    };
    /** Sparse vector from SPLADE models. */
    export type Vector = {
      indices: number[];
      values: number[];
    };
    export interface Run extends Model.Base.Run {
      input: string[];
    }
    export interface Config extends Model.Base.Config {
      concurrency?: number;
      throttleLimit?: number;
      throttleInterval?: number;
    }
    export interface Response extends Model.Base.Response {
      vectors: Vector[];
    }
    export type ApiResponse = Vector;
    export type Model = SparseVectorModel;
  }

  /** The type of data returned by the model */
  export type Type =
    | (string & {})
    | 'base'
    | 'completion'
    | 'chat'
    | 'embedding'
    | 'sparse-vector';
}
