import { PineconeHybridDatastore } from 'dexter/datastore/pinecone';
import { ChatModel, EmbeddingModel, SparseVectorModel } from 'dexter/model';

export interface Chunk {
  chunkId: string;
  chunkTitle: string;
  episodeTitle: string;
  imgUrl: string;
  published: string;
  url: string;
  transcript: string;
}

const embeddingModel = new EmbeddingModel({
  params: { model: 'text-embedding-ada-002' },
});

const spladeModel = new SparseVectorModel({
  params: {
    model: 'naver/splade-cocondenser-ensembledistil',
    concurrency: 30,
  },
});

export const chunkDatastore = new PineconeHybridDatastore<Chunk>({
  namespace: 'test12',
  contentKey: 'transcript',
  embeddingModel,
  spladeModel,
});

export const chatModel = new ChatModel({
  debug: true,
  params: {
    model: 'gpt-4',
    temperature: 0.5,
    max_tokens: 200,
  },
});
