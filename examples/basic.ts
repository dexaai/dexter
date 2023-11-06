import 'dotenv/config';
import { EmbeddingModel } from '@dexaai/dexter/model';
import { PineconeDatastore } from '@dexaai/dexter/datastore/pinecone';

/**
 * npx tsx examples/basic.ts
 */
async function main() {
  // Create a default OpenAI 'text-embedding-ada-002' embedding model
  // Requires process.env.OPENAI_API_KEY
  const embeddingModel = new EmbeddingModel();

  // Connect to a Pinecone datastore which uses our OpenAI embedding model
  // Requires process.env.PINECONE_API_KEY
  // Requires process.env.PINECONE_BASE_URL
  const store = new PineconeDatastore({
    contentKey: 'content',
    embeddingModel,
  });

  // Upsert some docs
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

  // Make some semantic queries
  const result = await store.query({ query: 'dolphin' });
  console.log(JSON.stringify(result, null, 2));

  const result2 = await store.query({ query: 'keyboard', topK: 3 });
  console.log(JSON.stringify(result2, null, 2));
}

main();
