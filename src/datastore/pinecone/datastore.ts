import { AbstractDatastore } from '../datastore.js';
import type { Datastore, Prettify } from '../types.js';
import type { PineconeClient } from './client.js';
import { createPineconeClient } from './client.js';
import type { Pinecone } from './types.js';

export class PineconeDatastore<
  DocMeta extends Datastore.BaseMeta
> extends AbstractDatastore<DocMeta, Pinecone.QueryFilter<DocMeta>> {
  datastoreType = 'embedding' as const;
  datastoreProvider = 'pinecone' as const;
  private readonly pinecone: PineconeClient<DocMeta>;

  constructor(
    args: Prettify<
      Datastore.Opts<DocMeta, Pinecone.QueryFilter<DocMeta>> & {
        pinecone?: PineconeClient<DocMeta>;
      }
    >
  ) {
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

    // Get the query embedding
    let queryEmbedding = query.embedding;

    // If no query embedding is provided, run the query embedder
    if (!queryEmbedding) {
      const { embeddings } = await this.embeddingModel.run(
        {
          input: [query.query],
        },
        mergedContext
      );
      const embedding = embeddings[0];
      queryEmbedding = embedding;
    }

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
      vector: queryEmbedding,
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
      // Get the text from the docs that are missing an embedding
      const textsToEmbed = docs
        .filter((doc) => !doc.embedding?.length)
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
            metadata: doc.metadata,
          })),
        });
      }

      // Create the embedding for docs that are missing one
      // This relies on the classes to handle batching and throttling
      const embeddingRes = await this.embeddingModel.run(
        { input: textsToEmbed },
        mergedContext
      );
      const embeddings = embeddingRes.embeddings;

      // Merge the existing embeddings and sparse vectors with the generated ones
      const docsWithEmbeddings = docs.map((doc) => {
        let embedding = doc.embedding;
        // If the doc was missing an embedding, use the generated one
        if (!embedding) {
          embedding = embeddings.shift();
          if (!embedding) {
            throw new Error('Unexpected missing embedding');
          }
        }
        return { ...doc, embedding };
      });

      // Combine the results into Pinecone's vector format and upsert
      // The Pinecone client will handle batching and throttling
      return this.pinecone.upsert({
        vectors: docs.map((doc, i) => ({
          id: doc.id,
          values: docsWithEmbeddings[i].embedding,
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
}
