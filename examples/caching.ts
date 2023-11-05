import 'dotenv/config';
import { EmbeddingModel, getModelMemoryCache } from 'dexa-ai/model';
import { getDatastoreMemoryCache } from 'dexa-ai/datastore';
import { PineconeDatastore } from 'dexa-ai/datastore/pinecone';

async function main() {
  // OpenAI embedding model with cache
  const embeddingModel = new EmbeddingModel({
    params: { model: 'text-embedding-ada-002' },
    context: { test: 'test' },
    events: { onApiResponse: [console.log] },
    cache: getModelMemoryCache(),
  });
  await embeddingModel.run({ input: ['cat'] });
  // This should be cached
  await embeddingModel.run({ input: ['cat'] });

  // Pinecone datastore with cache
  const store = new PineconeDatastore<{ content: string }>({
    contentKey: 'content',
    embeddingModel,
    events: { onQueryComplete: [console.log] },
    cache: getDatastoreMemoryCache(),
  });
  await store.upsert([
    { id: '1', metadata: { content: 'cat' } },
    { id: '2', metadata: { content: 'dog' } },
  ]);
  await store.query({ query: 'cat' });
  // This should be cached
  await store.query({ query: 'cat' });
}

main();
