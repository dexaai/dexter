import type { Datastore } from '../types.js';
export declare namespace Pinecone {
    /**
     * An object of metadata filters.
     * @see https://www.pinecone.io/docs/metadata-filtering/
     */
    export type QueryFilter<Metadata extends Datastore.BaseMeta> = {
        [key in keyof Metadata | FilterOperator]?: FilterValue | {
            [key in keyof Metadata | FilterOperator]?: FilterValue;
        };
    };
    /**
     * The possible leaf values for filter objects.
     * @note Null values aren't supported in metadata for filters, but are allowed here and automatically removed for convenience.
     */
    type FilterValue = string | number | boolean | null | string[] | number[];
    /** Mongo style query operators */
    type FilterOperator = '$eq' | '$ne' | '$gt' | '$gte' | '$lt' | '$lte' | '$in' | '$nin';
    export {};
}
