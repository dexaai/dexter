import 'dotenv/config';
import { Datastore, HybridDatastore } from '@dexaai/datastore/pinecone';
import { EmbeddingModel } from '@dexaai/model/openai';
import { SpladeModel } from '@dexaai/model/custom';

// Base Datastore
(async () => {
  const embeddingModel = new EmbeddingModel({
    params: {
      model: 'text-embedding-ada-002',
      batch: {
        maxBatchSize: 30,
        maxTokensPerBatch: 10000,
      },
      throttle: {
        maxConcurrentRequests: 1,
        maxRequestsPerMin: 1000,
      },
    },
    context: { test: 'test' },
    debug: true,
  });

  const store = new Datastore({
    namespace: 'test',
    contentKey: 'content',
    embeddingModel,
    debug: true,
  });

  await store.upsert([
    { id: '1', metadata: { content: 'cat' } },
    { id: '2', metadata: { content: 'dog' } },
    { id: '3', metadata: { content: 'whale' } },
    { id: '4', metadata: { content: 'shark' } },
    { id: '5', metadata: { content: 'computer' } },
    { id: '6', metadata: { content: 'laptop' } },
    { id: '7', metadata: { content: 'phone' } },
    { id: '8', metadata: { content: 'tablet' } },
  ]);

  const result = await store.query({
    query: 'dolphin',
  });
  console.log(JSON.stringify(result, null, 2));

  const result2 = await store.query({
    query: 'fox',
  });
  console.log(JSON.stringify(result2, null, 2));

  const result3 = await store.query({
    query: 'keyboard',
  });
  console.log(JSON.stringify(result3, null, 2));

  // Hybrid Datastore
  const spladeModel = new SpladeModel({
    params: { model: 'naver/splade-cocondenser-ensembledistil' },
    debug: true,
  });

  const hStore = new HybridDatastore({
    namespace: 'test-hybrid',
    contentKey: 'content',
    embeddingModel,
    spladeModel,
    context: { baz: 'qux' },
    debug: true,
  });

  await hStore.upsert([
    { id: '1', metadata: { content: 'cat' } },
    { id: '2', metadata: { content: 'dog' } },
    { id: '3', metadata: { content: 'whale' } },
    { id: '4', metadata: { content: 'shark' } },
    { id: '5', metadata: { content: 'computer' } },
    { id: '6', metadata: { content: 'laptop' } },
    { id: '7', metadata: { content: 'phone' } },
    { id: '8', metadata: { content: 'tablet' } },
  ]);

  await hStore.query({
    query: 'dolphin',
  });
  // console.log(JSON.stringify(r, null, 2));

  await hStore.query({
    query: 'fox',
  });
  // console.log(JSON.stringify(r2, null, 2));

  await hStore.query({
    query: 'keyboard',
  });
  // console.log(JSON.stringify(r3, null, 2));
})();
