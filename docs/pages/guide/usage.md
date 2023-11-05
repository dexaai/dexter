# Usage

```ts
import 'dotenv/config';
import { EmbeddingModel, PineconeDatastore } from '@dexaai/ai';

// Base Pinecone Datastore with OpenAI embeddings
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
    hooks: { onComplete: [console.log] },
  });

  const store = new PineconeDatastore({
    namespace: 'test',
    contentKey: 'content',
    embeddingModel,
    hooks: { onQueryComplete: [console.log] },
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
})();
```
