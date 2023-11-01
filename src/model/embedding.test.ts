import { describe, expect, it } from 'vitest';
import type { Model } from './types.js';
import { getMemoryCache } from './utils/memory-cache.js';
import { EmbeddingModel } from './embedding.js';

const FAKE_RESPONSE: Model.Embedding.Response = {
  data: [
    {
      index: 0,
      object: 'asdf',
      embedding: [1, 2, 3],
    },
  ],
  model: 'fake-model',
  object: 'asdf',
  usage: {
    prompt_tokens: 1,
    total_tokens: 1,
  },
  embeddings: [[1, 2, 3]],
  cached: false,
  cost: 0,
};

describe('EmbeddingModel', () => {
  let Client: Model.Embedding.Client;

  beforeEach(() => {
    vi.setSystemTime(new Date());
    Client = vi.fn() as unknown as Model.Embedding.Client;
    Client.createEmbeddings = vi
      .fn()
      .mockImplementation(() => Promise.resolve(FAKE_RESPONSE));
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  it('runs the model', async () => {
    const model = new EmbeddingModel({ client: Client });
    const response = await model.run({
      input: ['foo'],
    });
    expect(response).toEqual(FAKE_RESPONSE);
  });

  it('triggers hooks', async () => {
    const startHook = vi.fn();
    const apiResponseHook = vi.fn();
    const completeHook = vi.fn();
    const model = new EmbeddingModel({
      client: Client,
      params: { model: 'gpt-fake' },
      hooks: {
        onStart: [startHook],
        onApiResponse: [apiResponseHook],
        onComplete: [completeHook],
      },
      context: { userId: '123' },
    });
    await model.run({ input: ['foo'] });
    expect(startHook).toHaveBeenCalledOnce();
    expect(apiResponseHook).toHaveBeenCalledOnce();
    expect(completeHook).toHaveBeenCalledOnce();
    expect(apiResponseHook).toHaveBeenCalledWith({
      timestamp: new Date().toISOString(),
      modelType: 'embedding',
      modelProvider: 'openai',
      params: {
        model: 'gpt-fake',
        input: ['foo'],
      },
      response: FAKE_RESPONSE,
      latency: 0,
      context: { userId: '123' },
    });
  });

  it('implements clone', async () => {
    const model = new EmbeddingModel({
      client: Client,
      context: { userId: '123' },
      params: { model: 'gpt-fake' },
      hooks: { onApiResponse: [() => {}] },
    });
    const clonedModel = model.clone({
      context: { cloned: true },
      params: { model: 'gpt-fake-cloned' },
      hooks: { onApiResponse: [() => {}] },
    });
    expect(clonedModel.getContext()).toEqual({
      userId: '123',
      cloned: true,
    });
    expect(clonedModel.getParams()).toEqual({
      model: 'gpt-fake-cloned',
    });
    expect(clonedModel.getHooks()?.onApiResponse?.length).toBe(2);
  });

  it('can cache responses', async () => {
    const apiResponseHook = vi.fn();
    const completeHook = vi.fn();
    const model = new EmbeddingModel({
      cache: getMemoryCache(),
      client: Client,
      params: { model: 'gpt-fake' },
      hooks: { onApiResponse: [apiResponseHook], onComplete: [completeHook] },
      context: { userId: '123' },
    });
    await model.run({ input: ['foo'] });
    expect(apiResponseHook).toHaveBeenCalledOnce();
    expect(completeHook).toHaveBeenCalledOnce();
    expect(Client.createEmbeddings).toHaveBeenCalledOnce();
    // Make the same request that should be cached
    await model.run({ input: ['foo'] });
    // onApiResponse hook isn't triggered for cached responses
    expect(apiResponseHook).toHaveBeenCalledOnce();
    // onComplete is called for cached responses
    expect(completeHook).toHaveBeenCalledTimes(2);
    expect(Client.createEmbeddings).toHaveBeenCalledOnce();
  });
});
