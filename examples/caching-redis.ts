import 'dotenv/config';
import { EmbeddingModel } from '@dexaai/dexter/model';
import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';

/**
 * npx tsx examples/caching-redis.ts
 */
async function main() {
  const cache = new Keyv({
    store: new KeyvRedis(process.env.REDIS_URL!),
    namespace: 'dexter-test',
  });

  // OpenAI embedding model with cache
  const embeddingModel = new EmbeddingModel({
    params: { model: 'text-embedding-ada-002' },
    context: { test: 'test' },
    cache,
  });
  console.log(await embeddingModel.run({ input: ['cat'] }));
  // This should be cached
  console.log(await embeddingModel.run({ input: ['cat'] }));

  await cache.disconnect();
}

main();
