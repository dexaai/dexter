import type { ChatModel } from './types.js';

const cache = new Map<string, ChatModel.EnrichedResponse>();

/** A simple in-memory cache for chat responses. */
export const MemoryCache: ChatModel.Cache = {
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
