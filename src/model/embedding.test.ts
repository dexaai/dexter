import { describe, expect, it } from 'vitest';
import type { Model } from './types.js';
import { EmbeddingModel } from './embedding.js';

const FAKE_RESPONSE: Model.Embedding.Response = {
  data: [
    {
      index: 0,
      object: 'embedding',
      embedding: [1, 2, 3],
    },
  ],
  model: 'fake-model',
  object: 'embedding',
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

  it('triggers events', async () => {
    const startEvent = vi.fn();
    const apiResponseEvent = vi.fn();
    const completeEvent = vi.fn();
    const model = new EmbeddingModel({
      client: Client,
      params: { model: 'gpt-fake' },
      events: {
        onStart: [startEvent],
        onApiResponse: [apiResponseEvent],
        onComplete: [completeEvent],
      },
      context: { userId: '123' },
    });
    await model.run({ input: ['foo'] });
    expect(startEvent).toHaveBeenCalledOnce();
    expect(apiResponseEvent).toHaveBeenCalledOnce();
    expect(completeEvent).toHaveBeenCalledOnce();
    expect(apiResponseEvent).toHaveBeenCalledWith({
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
      events: { onApiResponse: [() => {}] },
    });
    const clonedModel = model.clone({
      context: { cloned: true },
      params: { model: 'gpt-fake-cloned' },
      events: { onApiResponse: [() => {}] },
    });
    expect(clonedModel.getContext()).toEqual({
      userId: '123',
      cloned: true,
    });
    expect(clonedModel.getParams()).toEqual({
      model: 'gpt-fake-cloned',
    });
    expect(clonedModel.getEvents()?.onApiResponse?.length).toBe(2);
  });

  it('can cache responses', async () => {
    const apiResponseEvent = vi.fn();
    const completeEvent = vi.fn();
    const model = new EmbeddingModel({
      cache: new Map(),
      client: Client,
      params: { model: 'gpt-fake' },
      events: {
        onApiResponse: [apiResponseEvent],
        onComplete: [completeEvent],
      },
      context: { userId: '123' },
    });
    await model.run({ input: ['foo'] });
    expect(apiResponseEvent).toHaveBeenCalledOnce();
    expect(completeEvent).toHaveBeenCalledOnce();
    expect(Client.createEmbeddings).toHaveBeenCalledOnce();
    // Make the same request that should be cached
    await model.run({ input: ['foo'] });
    // onApiResponse event isn't triggered for cached responses
    expect(apiResponseEvent).toHaveBeenCalledOnce();
    // onComplete is called for cached responses
    expect(completeEvent).toHaveBeenCalledTimes(2);
    expect(Client.createEmbeddings).toHaveBeenCalledOnce();
  });
});
