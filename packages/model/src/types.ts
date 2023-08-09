import type { ChatMessage } from 'openai-fetch';

export type { ChatMessage } from 'openai-fetch';

/** Generic metadata object. */
export type Ctx = { [key: string]: any };

/** Token counts for model request. */
export type TokenCounts = { prompt: number; completion: number; total: number };

/** Sparse vectors from SPLADE models. */
export type SparseValues = {
  indices: number[];
  values: number[];
};

/** Improve preview of union types in autocomplete. */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type ModelType =
  | 'base'
  | 'completion'
  | 'chat'
  | 'embedding'
  | 'sparse-vector';
export type ModelProvider = 'openai' | 'custom';

/**
 * Base model
 */
export interface ModelConfig {
  model: string;
}
export interface ModelRun {}
interface ModelParams extends ModelConfig, ModelRun {}
export interface ModelResponse {
  tokens: TokenCounts;
}
export interface IModel<
  MConfig extends ModelConfig,
  MRun extends ModelRun,
  ModelResp extends ModelResponse
> {
  modelType: ModelType;
  modelProvider: ModelProvider;
  run(params: MRun & Partial<MConfig>, context?: Ctx): Promise<ModelResp>;
}

/**
 * Chat model
 */
export interface ChatRun extends ModelRun {
  messages: ChatMessage[];
}
export interface ChatConfig extends ModelConfig {}
export interface ChatResponse extends ModelResponse {
  message: ChatMessage;
}
export interface IChatModel<
  CConfig extends ChatConfig,
  CRun extends ChatRun,
  CResponse extends ChatResponse
> extends IModel<CConfig, CRun, CResponse> {
  modelType: 'chat';
}

/**
 * Completion model
 */
export interface CompletionRun extends ModelRun {
  prompt: string[];
}
export interface CompletionConfig extends ModelConfig {}
export interface CompletionResponse extends ModelResponse {
  completions: { completion: string }[];
}
export interface ICompletionModel<
  CConfig extends CompletionConfig,
  CRun extends CompletionRun,
  CResponse extends CompletionResponse
> extends IModel<CConfig, CRun, CResponse> {
  modelType: 'completion';
}

/**
 * Embedding model
 */
export interface EmbeddingRun extends ModelRun {
  input: string[];
}
export interface EmbeddingConfig extends ModelConfig {}
export interface EmbeddingResponse extends ModelResponse {
  embeddings: number[][];
}
export interface IEmbeddingModel<
  EConfig extends EmbeddingConfig = EmbeddingConfig,
  ERun extends EmbeddingRun = EmbeddingRun,
  EResponse extends EmbeddingResponse = EmbeddingResponse
> extends IModel<EConfig, ERun, EResponse> {
  modelType: 'embedding';
}

/**
 * Sparse vector model (SPLADE)
 */
export interface SparseRun extends ModelRun {
  input: string[];
}
export interface SparseConfig extends ModelConfig {}
export interface SparseResponse extends ModelResponse {
  vectors: SparseValues[];
}
export interface ISparseModel<
  SConfig extends SparseConfig = SparseConfig,
  SRun extends SparseRun = SparseRun,
  SResponse extends SparseResponse = SparseResponse
> extends IModel<SConfig, SRun, SResponse> {
  modelType: 'sparse-vector';
}

/**
 * Hooks for logging and debugging
 */
export interface Hooks<
  MParams extends ModelParams,
  MResponse extends ModelResponse,
  AResponse extends any = any
> {
  afterApiResponse?: (event: {
    timestamp: string;
    modelType: ModelType;
    modelProvider: ModelProvider;
    params: MParams;
    response: AResponse;
    tokens: TokenCounts;
    latency: number;
    context: Ctx;
  }) => void | Promise<void>;
  afterCacheHit?: (event: {
    timestamp: string;
    modelType: ModelType;
    modelProvider: ModelProvider;
    params: MParams;
    response: MResponse;
    context: Ctx;
  }) => void | Promise<void>;
  beforeError?: (event: {
    timestamp: string;
    modelType: ModelType;
    modelProvider: ModelProvider;
    params: MParams;
    error: unknown;
    context: Ctx;
  }) => void | Promise<void>;
}

/**
 * Cache for storing model responses
 */
export interface ModelCache<
  MParams extends ModelParams,
  MResponse extends ModelResponse
> {
  get(key: MParams): Promise<MResponse | null>;
  set(key: MParams, value: MResponse): Promise<boolean>;
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

export type CreateTokenizer = (model: string) => ITokenizer;
