import type { ChatMessage } from 'openai-fetch';

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
    export interface Run {}
    export interface Params extends Config, Run {}
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
  }

  /**
   * Cache for storing model responses
   */
  export interface Cache<MParams extends Base.Params, MResponse extends any> {
    get(key: MParams): Promise<MResponse | null | undefined>;
    set(key: MParams, value: MResponse): Promise<boolean>;
  }

  /**
   * Chat Model
   */
  export namespace Chat {
    export interface Run extends Base.Run {
      messages: Model.Message[];
    }
    export interface Config extends Base.Config {
      /** Handle new chunk from streaming requests. */
      handleUpdate?: (chunk: string) => void;
    }
    export interface Response extends Base.Response {
      message: Model.Message;
    }
    export interface IModel<
      CConfig extends Chat.Config,
      CRun extends Chat.Run,
      CResponse extends Chat.Response
    > extends Base.IModel<CConfig, CRun, CResponse> {
      modelType: 'chat';
    }
  }

  /**
   * Completion model
   */
  export namespace Completion {
    export interface Run extends Base.Run {
      prompt:
        | string
        | Array<string>
        | Array<number>
        | Array<Array<number>>
        | null;
    }
    export interface Config extends Base.Config {}
    export interface Response extends Base.Response {
      completions: { completion: string }[];
    }
    export interface IModel<
      CConfig extends Config = Config,
      CRun extends Run = Run,
      CResponse extends Base.Response = Base.Response
    > extends Base.IModel<CConfig, CRun, CResponse> {
      modelType: 'completion';
    }
  }

  /** Generic metadata object. */
  export type Ctx = { [key: string]: any };

  /**
   * Embedding Model
   */
  export namespace Embedding {
    export interface Run extends Base.Run {
      input: string[];
    }
    export interface Config extends Base.Config {}
    export interface Response extends Base.Response {
      embeddings: number[][];
    }
    export interface IModel<
      EConfig extends Config = Config,
      ERun extends Run = Run,
      EResponse extends Base.Response = Base.Response
    > extends Base.IModel<EConfig, ERun, EResponse> {
      modelType: 'embedding';
    }
  }

  /**
   * Hooks for logging and debugging
   */
  export interface Hooks<
    MParams extends Base.Params,
    MResponse extends Base.Response,
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

  /** Token counts for model response. */
  export type TokenCounts = {
    prompt: number;
    completion: number;
    total: number;
  };

  /** The type of data returned by the model */
  export type Type =
    | 'base'
    | 'completion'
    | 'chat'
    | 'embedding'
    | 'sparse-vector';
}
