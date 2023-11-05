import type { Model } from '../model/index.js';
import type { AbstractDatastore } from './datastore.js';

/** Improve preview of union types in autocomplete. */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Generic Datastore extended by provider-specific implementations.
 */
export namespace Datastore {
  /** Base document metadata to be extended */
  export type BaseMeta = {};

  /**
   * Cache for storing query responses
   */
  export interface Cache<
    DocMeta extends BaseMeta,
    Filter extends BaseFilter<DocMeta>
  > {
    get(key: Query<DocMeta, Filter>): Promise<QueryResult<DocMeta> | null>;
    set(
      key: Query<DocMeta, Filter>,
      value: QueryResult<DocMeta>
    ): Promise<boolean>;
  }

  /** Generic metadata object. */
  export type Ctx = { [key: string]: any };

  /** A Doc is the unit of storage for data in a Datastore */
  export interface Doc<Meta extends BaseMeta = BaseMeta> {
    id: string;
    metadata: Meta;
    embedding?: number[];
    sparseVector?: Model.SparseVector.Vector;
    score?: number;
  }

  /**
   * Event handlers for logging and debugging
   */
  export interface Events<
    DocMeta extends BaseMeta,
    Filter extends BaseFilter<DocMeta>
  > {
    onQueryStart?: ((event: {
      timestamp: string;
      datastoreType: Type;
      datastoreProvider: Provider;
      query: Query<DocMeta, Filter>;
      context: Ctx;
    }) => void | Promise<void>)[];
    onQueryComplete?: ((event: {
      timestamp: string;
      datastoreType: Type;
      datastoreProvider: Provider;
      query: Query<DocMeta, Filter>;
      response: QueryResult<DocMeta>;
      latency: number;
      cached: boolean;
      context: Ctx;
    }) => void | Promise<void>)[];
    onError?: ((event: {
      timestamp: string;
      datastoreType: Type;
      datastoreProvider: Provider;
      error: unknown;
      context: Ctx;
    }) => void | Promise<void>)[];
  }

  /**
   * Abstract Datastore extended by provider specific implementations.
   */
  export type Datastore<
    DocMeta extends BaseMeta,
    Filter extends BaseFilter<DocMeta>
  > = AbstractDatastore<DocMeta, Filter>;

  /**
   * Options for creating a Datastore instance.
   */
  export interface Opts<
    DocMeta extends BaseMeta,
    Filter extends BaseFilter<DocMeta>
  > {
    /**
     * The metadata key of the content that is embedded.
     * The value associated with the key must be a string.
     */
    contentKey: keyof DocMeta;
    namespace?: string;
    embeddingModel: Model.Embedding.Model;
    cache?: Cache<DocMeta, Filter>;
    events?: Events<DocMeta, Filter>;
    context?: Ctx;
    debug?: boolean;
  }

  /**
   * Options for creating a hybrid Datastore instance (with Splade).
   */
  export interface OptsHybrid<
    DocMeta extends BaseMeta,
    Filter extends BaseFilter<DocMeta>
  > extends Opts<DocMeta, Filter> {
    /** Splade instance for creating sparse vectors */
    spladeModel: Model.SparseVector.Model;
  }

  /** The provider of the vector database. */
  export type Provider = (string & {}) | 'pinecone' | 'custom';

  /**
   * Arguments to run a query.
   */
  export interface Query<
    Meta extends BaseMeta,
    Filter extends BaseFilter<Meta>
  > {
    query: string;
    embedding?: number[];
    sparseVector?: Model.SparseVector.Vector;
    topK?: number;
    minScore?: number;
    filter?: Filter;
    includeValues?: boolean;
    hybridAlpha?: number;
  }

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export type BaseFilter<Meta extends BaseMeta> = any;

  /**
   * The results of running a query.
   */
  export interface QueryResult<Meta extends BaseMeta> {
    query: string;
    docs: ScoredDoc<Meta>[];
    cached?: boolean;
  }

  /**
   * Document with a query score (vector distance/similarity).
   */
  export interface ScoredDoc<Meta extends BaseMeta = BaseMeta>
    extends Doc<Meta> {
    score: number;
  }

  /** The type of embedding model. */
  export type Type = (string & {}) | 'embedding' | 'hybrid';
}
