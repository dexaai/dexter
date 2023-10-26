import type { Model } from '@dexaai/model';
import { AbstractHybridDatastore } from '../hybrid-datastore.js';
import type { Dstore, Prettify } from '../types.js';
import type { PineconeClient } from './client.js';
import { createPineconeClient } from './client.js';

export class HybridDatastore<DocMeta extends Dstore.BaseMeta>
  extends AbstractHybridDatastore<DocMeta>
  implements Dstore.IDatastore<DocMeta>
{
  datastoreType = 'hybrid' as const;
  datastoreProvider = 'pinecone' as const;
  private readonly pinecone: PineconeClient<DocMeta>;

  constructor(
    args: Prettify<
      Dstore.OptsHybrid<DocMeta> & {
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
    query: Dstore.Query<DocMeta>,
    context?: Dstore.Ctx
  ): Promise<Dstore.QueryResult<DocMeta>> {
    const mergedContext = { ...this.context, ...context };

    // Get the query embedding and sparse vector
    const queryEmbedding = query.embedding;
    const querySparseVector = query.sparseVector;
    const [
      {
        embeddings: [embedding],
      },
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

    // Query Pinecone
    const start = Date.now();
    const response = await this.pinecone.query({
      topK: query.topK ?? 10,
      ...(typeof query.minScore === 'number'
        ? { minScore: query.minScore }
        : {}),
      ...(query.filter && { filter: query.filter }),
      includeValues: query.includeValues ?? false,
      includeMetadata: true,
      vector: embedding,
      sparseVector: sparseVector,
    });
    const latency = Date.now() - start;
    await this.hooks.afterApiResponse?.({
      timestamp: new Date().toISOString(),

      datastoreType: this.datastoreType,
      datastoreProvider: this.datastoreProvider,
      query,
      response,
      context: mergedContext,
      latency,
    });

    const queryResult: Dstore.QueryResult<DocMeta> = {
      query: query.query,
      docs: response.matches,
    };

    return queryResult;
  }

  async upsert(
    docs: Dstore.Doc<DocMeta>[],
    context?: Dstore.Ctx
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

      // Merge the existing embeddings and sparse vectors with the generated ones
      const docsWithEmbeddings = docs.map((doc) => {
        let embedding = doc.embedding;
        let sparseVector = doc.sparseVector;
        // If the doc was missing an embedding or sparse vector, use the generated values
        if (embedding == null || sparseVector == null) {
          embedding = embeddingRes.embeddings.shift();
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
      await this.hooks.beforeError?.({
        timestamp: new Date().toISOString(),
        datastoreType: this.datastoreType,
        datastoreProvider: this.datastoreProvider,
        upsert: docs,
        error,
        context: mergedContext,
      });
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
