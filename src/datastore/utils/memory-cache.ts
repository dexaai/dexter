import type { Dstore } from '../types.js';

/** A simple in-memory cache for model responses */
export function getMemoryCache<
  DocMeta extends Dstore.BaseMeta,
  Filter extends Dstore.BaseFilter<DocMeta>
>() {
  const cache = new Map<string, Dstore.QueryResult<DocMeta>>();

  const MemoryCache: Dstore.Cache<DocMeta, Filter> = {
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
