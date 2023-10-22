import type { ChatCache, EnrichedChatResponse } from './types.js';

const cache = new Map<string, EnrichedChatResponse>();

/** A simple in-memory cache for chat responses. */
export const MemoryCache: ChatCache = {
  get: async (params) => {
    const key = JSON.stringify(params);
    const cachedResponse = cache.get(key);
    return cachedResponse;
  },
  set: async (params, response) => {
    const key = JSON.stringify(params);
    cache.set(key, response);
  },
};
