import 'dotenv/config';
import { Datastore } from '@dexaai/datastore/pinecone';
import { EmbeddingModel } from '@dexaai/model/openai';

// Base Datastore
(async () => {
  // Embedding model with cache
  const embeddingModel = new EmbeddingModel({
    params: { model: 'text-embedding-ada-002' },
    context: { test: 'test' },
    debug: true,
  }).addCache();
  await embeddingModel.run({ input: ['cat'] });
  // This should be cached
  await embeddingModel.run({ input: ['cat'] });

  // Datastore with cache
  const store = new Datastore({
    namespace: 'test',
    embeddingModel,
    debug: true,
  }).addCache();
  await store.upsert([
    { id: '1', metadata: { content: 'cat' } },
    { id: '2', metadata: { content: 'dog' } },
  ]);
  await store.query({ query: 'cat' });
  // This should be cached
  await store.query({ query: 'cat' });
})();
