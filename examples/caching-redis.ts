import 'dotenv/config';

<<<<<<< HEAD
=======
import { EmbeddingModel } from '@dexaai/dexter';
>>>>>>> origin/master
import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';

import { EmbeddingModel } from '../src/index.js';

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
