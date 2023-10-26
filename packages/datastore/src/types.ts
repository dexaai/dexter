import type { Model } from '@dexaai/model';

/** Improve preview of union types in autocomplete. */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Generic Datastore extended by provider-specific implementations.
 */
export namespace Dstore {
  /** Base document metadata to be extended */
  export type BaseMeta = {};

  /**
   * Cache for storing query responses
   */
  export interface Cache<DocMeta extends BaseMeta> {
    get(key: Query<DocMeta>): Promise<QueryResult<DocMeta> | null>;
    set(key: Query<DocMeta>, value: QueryResult<DocMeta>): Promise<boolean>;
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
   * The possible leaf values for filter objects.
   * @note Null values aren't supported in metadata for filters, but are allowed here and automatically removed for convenience.
   */
  type FilterValue = string | number | boolean | null | string[] | number[];

  /** Mongo style query operators */
  type FilterOperator =
    | '$eq'
    | '$ne'
    | '$gt'
    | '$gte'
    | '$lt'
    | '$lte'
    | '$in'
    | '$nin';

  /**
   * Hooks for logging and debugging
   */
  export interface Hooks<DocMeta extends BaseMeta> {
    afterApiResponse?: (event: {
      timestamp: string;
      datastoreType: Type;
      datastoreProvider: Provider;
      query: Query<DocMeta>;
      response: unknown;
      latency: number;
      context: Ctx;
    }) => void | Promise<void>;
    afterCacheHit?: (event: {
      timestamp: string;
      datastoreType: Type;
      datastoreProvider: Provider;
      query: Query<DocMeta>;
      response: unknown;
      context: Ctx;
    }) => void | Promise<void>;
    beforeError?: (event: {
      timestamp: string;
      datastoreType: Type;
      datastoreProvider: Provider;
      query?: Query<DocMeta>;
      upsert?: Doc<DocMeta>[];
      error: unknown;
      context: Ctx;
    }) => void | Promise<void>;
  }

  /**
   * Datastore interface implemented by provider specific implementations.
   */
  export interface IDatastore<DocMeta extends BaseMeta> {
    /** Query the DataStore for documents. */
    query(query: Query<DocMeta>, context?: Ctx): Promise<QueryResult<DocMeta>>;

    /** Insert or update documents in the DataStore. */
    upsert(docs: Doc<DocMeta>[], context?: Ctx): Promise<void>;

    /** Delete documents by ID from the DataStore. */
    delete(docIds: string[]): Promise<void>;

    /** Delete all documents from the DataStore. */
    deleteAll(): Promise<void>;
  }

  /**
   * Options for creating a Datastore instance.
   */
  export interface Opts<DocMeta extends BaseMeta> {
    /**
     * The metadata key of the content that is embedded.
     * The value associated with the key must be a string.
     */
    contentKey: keyof DocMeta;
    namespace: string;
    embeddingModel: Model.Embedding.IModel;
    cache?: Cache<DocMeta>;
    hooks?: Hooks<DocMeta>;
    context?: Ctx;
    debug?: boolean;
  }

  /**
   * Options for creating a hybrid Datastore instance (with Splade).
   */
  export interface OptsHybrid<DocMeta extends BaseMeta> extends Opts<DocMeta> {
    /** Splade instance for creating sparse vectors */
    spladeModel: Model.SparseVector.IModel;
  }

  /** The provider of the vector database. */
  export type Provider = (string & {}) | 'pinecone' | 'custom';

  /**
   * Arguments to run a query.
   */
  export interface Query<Meta extends BaseMeta> {
    query: string;
    embedding?: number[];
    sparseVector?: Model.SparseVector.Vector;
    topK?: number;
    minScore?: number;
    filter?: QueryFilter<Meta>;
    includeValues?: boolean;
  }
  /**
   * An object of metadata filters.
   * @see https://www.pinecone.io/docs/metadata-filtering/
   */
  export type QueryFilter<Metadata extends BaseMeta> = {
    [key in keyof Metadata | FilterOperator]?:
      | FilterValue
      | {
          [key in keyof Metadata | FilterOperator]?: FilterValue;
        };
  };

  /**
   * The results of running a query.
   */
  export interface QueryResult<Meta extends BaseMeta> {
    query: string;
    docs: ScoredDoc<Meta>[];
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
