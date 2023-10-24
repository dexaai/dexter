import type { ChatMessage } from 'openai-fetch';

export namespace Model {
  /** Token counts for model request. */
  export type TokenCounts = {
    prompt: number;
    completion: number;
    total: number;
  };

  /** Generic metadata object. */
  export type Ctx = { [key: string]: any };

  /** Primary message type for chat models */
  export type Message = ChatMessage;

  /**
   * Client for making API calls.
   * TODO: more specific?
   */
  export type Client = any;

  /** Sparse vectors from SPLADE models. */
  export type SparseValues = {
    indices: number[];
    values: number[];
  };

  export type Type =
    | 'base'
    | 'completion'
    | 'chat'
    | 'embedding'
    | 'sparse-vector';
  export type Provider = 'openai' | 'custom';

  /**
   * Base model
   */
  export interface Config {
    model: string;
  }
  export interface Run {}
  interface Params extends Config, Run {}
  export interface Response {
    cached: boolean;
    cost?: number;
    tokens: TokenCounts;
  }
  export interface IModel<
    MConfig extends Config,
    MRun extends Run,
    ModelResp extends Response
  > {
    modelType: Type;
    modelProvider: Provider;
    run(params: MRun & Partial<MConfig>, context?: Ctx): Promise<ModelResp>;
  }

  /**
   * Hooks for logging and debugging
   */
  export interface Hooks<
    MParams extends Params,
    MResponse extends Response,
    AResponse extends any = any
  > {
    onStart?: ((event: {
      timestamp: string;
      modelType: Type;
      modelProvider: Provider;
      params: MParams;
      context: Ctx;
    }) => void | Promise<void>)[];
    onApiResponse?: ((event: {
      timestamp: string;
      modelType: Type;
      modelProvider: Provider;
      params: MParams;
      response: AResponse;
      latency: number;
      context: Ctx;
    }) => void | Promise<void>)[];
    onComplete?: ((event: {
      timestamp: string;
      modelType: Type;
      modelProvider: Provider;
      params: MParams;
      response: MResponse;
      context: Ctx;
      cached: boolean;
    }) => void | Promise<void>)[];
    onError?: ((event: {
      timestamp: string;
      modelType: Type;
      modelProvider: Provider;
      params: MParams;
      error: unknown;
      context: Ctx;
    }) => void | Promise<void>)[];
  }

  /**
   * Cache for storing model responses
   */
  export interface Cache<MParams extends Params, MResponse extends any> {
    get(key: MParams): Promise<MResponse | null | undefined>;
    set(key: MParams, value: MResponse): Promise<boolean>;
  }

  export namespace Chat {
    export interface Run extends Model.Run {
      messages: Model.Message[];
    }
    export interface Config extends Model.Config {}
    export interface Response extends Model.Response {
      message: Model.Message;
    }
    export interface IModel<
      CConfig extends Chat.Config,
      CRun extends Chat.Run,
      CResponse extends Chat.Response
    > extends Model.IModel<CConfig, CRun, CResponse> {
      modelType: 'chat';
    }
  }

  export namespace Embedding {
    export interface Run extends Model.Run {
      input: string[];
    }
    export interface Config extends Model.Config {}
    export interface Response extends Model.Response {
      embeddings: number[][];
    }
    export interface IModel<
      EConfig extends Config = Config,
      ERun extends Run = Run,
      EResponse extends Response = Response
    > extends Model.IModel<EConfig, ERun, EResponse> {
      modelType: 'embedding';
    }
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
}
