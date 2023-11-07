# Caching

LLMs, embedding models, and datastores all work with the same `cache` and `cacheKey` parameters and support basically any caching strategy you can think of.

By default, caching is not enabled on any of the classes.

**To enable caching, pass in a `cache` object**, which must implement `.get(key)` and `.set(key, value)`, both of which can be either sync or async.

The `cache` object is designed to work with `new Map()`, [quick-lru](https://github.com/sindresorhus/quick-lru), [any keyv adaptor](https://github.com/jaredwray/keyv), or any other key-value store.

`cacheKey` is an optional function which takes in a params object and returns the cache key **string** to use for that request. A simple example would be: `(params) => JSON.stringify(params)`. The default `cacheKey` function uses [hash-object](https://github.com/sindresorhus/hash-object) to create a stable sha256 hash of the params.

## Examples

### In-Memory Caches

```ts
import { EmbeddingModel } from '@dexaai/dexter/model';
import QuickLRU from 'quick-lru';

// Basic in-memory cache
const embeddingModel = new EmbeddingModel({
  cache: new Map(),
});

// LRU in-memory cache
const embeddingModel = new EmbeddingModel({
  cache: new QuickLRU({ maxSize: 10000 }),
});
```

### Redis Keyv Cache

```ts
import { EmbeddingModel } from '@dexaai/dexter/model';
import { PineconeDatastore } from '@dexaai/dexter/datastore/pinecone';
import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';

const cache = new Keyv({
  store: new KeyvRedis(process.env.REDIS_URL!),
  namespace: 'dexter-test',
});

const embeddingModel = new EmbeddingModel({
  cache,
});

const store = new PineconeDatastore<{ content: string }>({
  contentKey: 'content',
  embeddingModel,
  cache,
});

// run your app...

// Close your redis connection at the end
await cache.disconnect();
```

### Custom Cache Key

```ts
import { ChatModel } from '@dexaai/dexter/model';
import { pick } from '@dexaai/utils';
import hashObject from 'hash-object';

// Create an OpenAI chat completion model w/ an in-memory cache using a
// custom cache key
const chatModel = new ChatModel({
  cacheKey: (params) => hashObject(pick(params, 'model', 'messages')),
  cache: new Map(),
});
```
