import type {
  IEmbeddingModel,
  ISparseModel,
  SparseValues,
} from '@dexaai/model';

export type DatastoreType = 'embedding' | 'hybrid';
export type DatastoreProvider = 'pinecone' | 'custom';

export type BaseMeta = {};

/** Generic metadata object. */
export type Ctx = { [key: string]: any };

export interface QueryCache<DocMeta extends BaseMeta> {
  get(key: Query<DocMeta>): Promise<QueryResult<DocMeta> | null>;
  set(key: Query<DocMeta>, value: QueryResult<DocMeta>): Promise<boolean>;
}

export interface Hooks<DocMeta extends BaseMeta> {
  afterApiResponse?: (event: {
    timestamp: string;
    datastoreType: DatastoreType;
    datastoreProvider: DatastoreProvider;
    query: Query<DocMeta>;
    response: unknown;
    latency: number;
    context: Ctx;
  }) => void | Promise<void>;
  afterCacheHit?: (event: {
    timestamp: string;
    datastoreType: DatastoreType;
    datastoreProvider: DatastoreProvider;
    query: Query<DocMeta>;
    response: unknown;
    context: Ctx;
  }) => void | Promise<void>;
  beforeError?: (event: {
    timestamp: string;
    datastoreType: DatastoreType;
    datastoreProvider: DatastoreProvider;
    query?: Query<DocMeta>;
    upsert?: Doc<DocMeta>[];
    error: unknown;
    context: Ctx;
  }) => void | Promise<void>;
}

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
export interface DatastoreOpts<DocMeta extends BaseMeta> {
  /**
   * The metadata key of the content that is embedded.
   * The value associated with the key must be a string.
   */
  contentKey: keyof DocMeta;
  namespace: string;
  embeddingModel: IEmbeddingModel;
  cache?: QueryCache<DocMeta>;
  hooks?: Hooks<DocMeta>;
  context?: Ctx;
  debug?: boolean;
}

/**
 * Options for creating a hybrid Datastore instance (with Splade).
 */
export interface HDatastoreOpts<DocMeta extends BaseMeta>
  extends DatastoreOpts<DocMeta> {
  /**
   * Splade instance for creating sparse vectors
   */
  spladeModel: ISparseModel;
}

export interface Doc<Meta extends BaseMeta = BaseMeta> {
  id: string;
  metadata: Meta;
  embedding?: number[];
  sparseVector?: SparseValues;
  score?: number;
}
export interface ScoredDoc<Meta extends BaseMeta = BaseMeta> extends Doc<Meta> {
  score: number;
}

export interface Query<Meta extends BaseMeta> {
  query: string;
  embedding?: number[];
  sparseVector?: SparseValues;
  topK?: number;
  minScore?: number;
  filter?: QueryFilter<Meta>;
  includeValues?: boolean;
}
export interface QueryResult<Meta extends BaseMeta> {
  query: string;
  docs: ScoredDoc<Meta>[];
}

/**
 * The possible leaf values for filter objects.
 * @note Null values aren't supported in metadata for filters, but are allowed here and automatically removed for convenience.
 */
type FilterValue = string | number | boolean | null | string[] | number[];
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

/** Improve preview of union types in autocomplete. */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
