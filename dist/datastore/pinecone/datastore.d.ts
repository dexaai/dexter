import { AbstractDatastore } from '../datastore.js';
import type { Datastore, Prettify } from '../types.js';
import type { PineconeClient } from './client.js';
import type { Pinecone } from './types.js';
export declare class PineconeDatastore<DocMeta extends Datastore.BaseMeta> extends AbstractDatastore<DocMeta, Pinecone.QueryFilter<DocMeta>> {
    datastoreType: "embedding";
    datastoreProvider: "pinecone";
    private readonly pinecone;
    constructor(args: Prettify<Datastore.Opts<DocMeta, Pinecone.QueryFilter<DocMeta>> & {
        pinecone?: PineconeClient<DocMeta>;
    }>);
    runQuery(query: Datastore.Query<DocMeta, Pinecone.QueryFilter<DocMeta>>, context?: Datastore.Ctx): Promise<Datastore.QueryResult<DocMeta>>;
    upsert(docs: Datastore.Doc<DocMeta>[], context?: Datastore.Ctx): Promise<void>;
    delete(docIds: string[]): Promise<void>;
    deleteAll(): Promise<void>;
}
