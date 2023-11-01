import type { Model } from '../types.js';

/** A simple in-memory cache for model responses */
export function getMemoryCache<
  Config extends Model.Base.Config,
  Response extends Model.Base.Response
>() {
  const cache = new Map<string, Response>();

  const MemoryCache: Model.Cache<Config, Response> = {
    get: async (params) => {
      const key = JSON.stringify(params);
      const cachedResponse = cache.get(key);
      return cachedResponse;
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
