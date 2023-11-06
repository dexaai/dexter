# Usage

This example shows how to use the OpenAI [text-embedding-ada-002](https://platform.openai.com/docs/guides/embeddings) embedding model and a [Pinecone](https://www.pinecone.io/) datastore to index and query a set of documents.

```ts
import 'dotenv/config';
import { EmbeddingModel } from '@dexaai/dexter/model';
import { PineconeDatastore } from '@dexaai/dexter/datastore/pinecone';

async function example() {
  const embeddingModel = new EmbeddingModel({
    params: { model: 'text-embedding-ada-002' },
  });

  const store = new PineconeDatastore({
    contentKey: 'content',
    embeddingModel,
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

  const result = await store.query({ query: 'dolphin' });
  console.log(result);
}
```

You can run this example by cloning this repo by following [these instructions](./examples.md).
