import { type Model } from '../../model/index.js';
import { deepMerge, mergeEvents } from '../../utils/helpers.js';
import { AbstractHybridDatastore } from '../hybrid-datastore.js';
import { type Datastore, type Prettify } from '../types.js';
import { createPineconeClient, type PineconeClient } from './client.js';
import { type Pinecone } from './types.js';

export type PineconeHybridDatastoreArgs<DocMeta extends Datastore.BaseMeta> =
  Prettify<
    Datastore.OptsHybrid<DocMeta, Pinecone.QueryFilter<DocMeta>> & {
      pinecone?: PineconeClient<DocMeta>;
    }
  >;

export class PineconeHybridDatastore<
  DocMeta extends Datastore.BaseMeta,
> extends AbstractHybridDatastore<DocMeta, Pinecone.QueryFilter<DocMeta>> {
  datastoreType = 'hybrid' as const;
  datastoreProvider = 'pinecone' as const;
  private readonly pinecone: PineconeClient<DocMeta>;

  constructor(args: PineconeHybridDatastoreArgs<DocMeta>) {
    const { pinecone, ...rest } = args;
    super(rest);
    this.pinecone =
      pinecone ||
      createPineconeClient<DocMeta>({
        namespace: this.namespace,
      });
  }

  async runQuery(
    query: Datastore.Query<DocMeta, Pinecone.QueryFilter<DocMeta>>,
    context?: Datastore.Ctx
  ): Promise<Datastore.QueryResult<DocMeta>> {
    const mergedContext = { ...this.context, ...context };

    // Get the query embedding and sparse vector
    const queryEmbedding = query.embedding;
    const querySparseVector = query.sparseVector;
    const [
      { embeddings },
      {
        vectors: [sparseVector],
      },
    ] = await Promise.all([
      queryEmbedding
        ? { embeddings: [queryEmbedding] }
        : this.embeddingModel.run(
            {
              input: [query.query],
            },
            mergedContext
          ),
      querySparseVector
        ? { vectors: [querySparseVector] }
        : this.spladeModel.run(
            {
              input: [query.query],
            },
            mergedContext
          ),
    ]);
    const embedding = embeddings[0];

    // Query Pinecone
    const response = await this.pinecone.query({
      topK: query.topK ?? 10,
      ...(typeof query.minScore === 'number'
        ? { minScore: query.minScore }
        : {}),
      ...(query.filter && { filter: query.filter }),
      ...(typeof query.hybridAlpha === 'number' && {
        hybridAlpha: query.hybridAlpha,
      }),
      includeValues: query.includeValues ?? false,
      includeMetadata: true,
      vector: embedding,
      sparseVector,
    });

    const queryResult: Datastore.QueryResult<DocMeta> = {
      query: query.query,
      docs: response.matches,
    };

    return queryResult;
  }

  async upsert(
    docs: Datastore.Doc<DocMeta>[],
    context?: Datastore.Ctx
  ): Promise<void> {
    const mergedContext = { ...this.context, ...context };
    try {
      // Get the text from the docs that are missing embeddings or sparse vectors
      const textsToEmbed = docs
        .filter((doc) => doc.embedding == null || doc.sparseVector == null)
        .map((doc) => {
          const content = doc.metadata[this.contentKey];
          if (typeof content !== 'string') {
            throw new Error(
              `The value of the contentKey (${String(
                this.contentKey
              )}) must be a string`
            );
          }
          return content;
        });

      if (textsToEmbed.length === 0) {
        return this.pinecone.upsert({
          vectors: docs.map((doc, i) => ({
            id: doc.id,
            values: docs[i].embedding as number[],
            sparseValues: docs[i].sparseVector as Model.SparseVector.Vector,
            metadata: doc.metadata,
          })),
        });
      }

      // Create the embeddings and sparse vectors
      // This relies on the classes to handle batching and throttling
      const [embeddingRes, spladeRes] = await Promise.all([
        this.embeddingModel.run({ input: textsToEmbed }, mergedContext),
        this.spladeModel.run({ input: textsToEmbed }, mergedContext),
      ]);

      const embeddings = embeddingRes.embeddings;

      // Merge the existing embeddings and sparse vectors with the generated ones
      const docsWithEmbeddings = docs.map((doc) => {
        let embedding = doc.embedding;
        let sparseVector = doc.sparseVector;
        // If the doc was missing an embedding or sparse vector, use the generated values
        if (embedding == null || sparseVector == null) {
          embedding = embeddings.shift();
          sparseVector = spladeRes.vectors.shift();
          if (embedding == null || sparseVector == null) {
            throw new Error('Unexpected missing embedding or sparse vector');
          }
        }
        return {
          ...doc,
          embedding,
          sparseVector,
        };
      });

      // Combine the results into Pinecones vector format and upsert
      return this.pinecone.upsert({
        vectors: docs.map((doc, i) => ({
          id: doc.id,
          values: docsWithEmbeddings[i].embedding,
          sparseValues: docsWithEmbeddings[i].sparseVector,
          metadata: doc.metadata,
        })),
      });
    } catch (error) {
      await Promise.allSettled(
        this.events?.onError?.map((event) =>
          Promise.resolve(
            event({
              timestamp: new Date().toISOString(),
              datastoreType: this.datastoreType,
              datastoreProvider: this.datastoreProvider,
              error,
              context: mergedContext,
            })
          )
        ) ?? []
      );
      throw error;
    }
  }

  async delete(docIds: string[]): Promise<void> {
    return this.pinecone.delete({ ids: docIds });
  }

  async deleteAll(): Promise<void> {
    return this.pinecone.delete({ deleteAll: true });
  }

  /** Clones the datastore, optionally modifying it's config */
  extend(args?: Partial<PineconeHybridDatastoreArgs<DocMeta>>): this {
    return new PineconeHybridDatastore({
      contentKey: this.contentKey,
      namespace: this.namespace,
      embeddingModel: this.embeddingModel,
      cacheKey: this.cacheKey,
      cache: this.cache,
      debug: this.debug,
      pinecone: this.pinecone,
      spladeModel: this.spladeModel,
      ...args,
      context: deepMerge(this.context, args?.context),
      events: mergeEvents(this.events, args?.events),
    }) as unknown as this;
  }
}
