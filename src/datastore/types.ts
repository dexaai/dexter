import type { Model } from '../model/index.js';
import type { AbstractDatastore } from './datastore.js';
import { type CacheKey, type CacheStorage } from '../utils/cache.js';

/** Improve preview of union types in autocomplete. */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Generic Datastore extended by provider-specific implementations.
 */
export namespace Datastore {
  /** Base document metadata to be extended */
  export type BaseMeta = {};

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
    /**
     * A function that returns a cache key for the given params.
     *
     * A simple example would be: `(params) => JSON.stringify(params)`
     *
     * The default `cacheKey` function uses [hash-obj](https://github.com/sindresorhus/hash-obj) to create a stable sha256 hash of the params.
     */
    cacheKey?: CacheKey<Query<DocMeta, Filter>, string>;
    /**
     * Enables caching for queries. Must implement `.get(key)` and `.set(key, value)`, both of which can be either sync or async.
     *
     * Some examples include: `new Map()`, [quick-lru](https://github.com/sindresorhus/quick-lru), or any [keyv adaptor](https://github.com/jaredwray/keyv).
     */
    cache?: CacheStorage<string, QueryResult<DocMeta>>;
    events?: Events<DocMeta, Filter>;
    context?: Ctx;
    /** Whether or not to add default `console.log` event handlers */
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
