import 'dotenv/config';
import { EmbeddingModel } from 'dexter/model';
import { PineconeDatastore } from 'dexter/datastore/pinecone';
import QuickLRU from 'quick-lru';

/**
 * npx tsx examples/caching.ts
 */
async function main() {
  // OpenAI embedding model with cache
  const embeddingModel = new EmbeddingModel({
    params: { model: 'text-embedding-ada-002' },
    context: { test: 'test' },
    events: { onApiResponse: [console.log] },
    cache: new QuickLRU({ maxSize: 10000 }),
  });
  await embeddingModel.run({ input: ['cat'] });
  // This should be cached
  await embeddingModel.run({ input: ['cat'] });

  // Pinecone datastore with cache
  const store = new PineconeDatastore<{ content: string }>({
    contentKey: 'content',
    embeddingModel,
    events: { onQueryComplete: [console.log] },
    cache: new Map(),
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
