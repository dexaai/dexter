import type { Datastore } from '../types.js';

/** A simple in-memory cache for model responses */
export function getDatastoreMemoryCache<
  DocMeta extends Datastore.BaseMeta,
  Filter extends Datastore.BaseFilter<DocMeta>
>() {
  const cache = new Map<string, Datastore.QueryResult<DocMeta>>();

  const MemoryCache: Datastore.Cache<DocMeta, Filter> = {
    get: async (params) => {
      const key = JSON.stringify(params);
      const cachedResponse = cache.get(key);
      return cachedResponse ?? null;
    },
    set: async (params, response) => {
      const key = JSON.stringify(params);
      try {
        cache.set(key, response);
        return true;
      } catch (e) {
        return false;
      }
    },
  };

  return MemoryCache;
}
