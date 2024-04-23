import { describe, expect, it, vi } from 'vitest';
import type { Model } from './types.js';
import { ChatModel } from './chat.js';

const FAKE_RESPONSE: Model.Chat.Response = {
  message: {
    content: 'Hi from fake AI',
    role: 'assistant',
  },
  cached: false,
  latency: 0,
  cost: 0,
  created: 0,
  id: 'fake-id',
  model: 'gpt-fake',
  object: 'chat.completion',
  usage: {
    completion_tokens: 1,
    prompt_tokens: 1,
    total_tokens: 2,
  },
  choices: [
    {
      finish_reason: 'stop',
      index: 0,
      message: {
        content: 'Hi from fake AI',
        role: 'assistant',
      },
      logprobs: null,
    },
  ],
};

describe('ChatModel', () => {
  let Client: Model.Chat.Client;

  beforeEach(() => {
    vi.setSystemTime(new Date());
    Client = vi.fn() as unknown as Model.Chat.Client;
    Client.createChatCompletion = vi
      .fn()
      .mockImplementation(() => Promise.resolve(FAKE_RESPONSE));
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  it('runs the model', async () => {
    const chatModel = new ChatModel({ client: Client });
    const response = await chatModel.run({
      messages: [{ role: 'user', content: 'content' }],
    });
    expect(response).toEqual(FAKE_RESPONSE);
  });

  it('triggers events', async () => {
    const startEvent = vi.fn();
    const apiResponseEvent = vi.fn();
    const completeEvent = vi.fn();
    const chatModel = new ChatModel({
      client: Client,
      params: { model: 'gpt-fake' },
      events: {
        onStart: [startEvent],
        onApiResponse: [apiResponseEvent],
        onComplete: [completeEvent],
      },
      context: { userId: '123' },
    });
    await chatModel.run({
      messages: [{ role: 'user', content: 'content' }],
    });
    expect(startEvent).toHaveBeenCalledOnce();
    expect(apiResponseEvent).toHaveBeenCalledOnce();
    expect(completeEvent).toHaveBeenCalledOnce();
    expect(apiResponseEvent).toHaveBeenCalledWith({
      timestamp: new Date().toISOString(),
      modelType: 'chat',
      modelProvider: 'openai',
      params: {
        model: 'gpt-fake',
        messages: [{ role: 'user', content: 'content' }],
      },
      response: FAKE_RESPONSE,
      latency: 0,
      context: { userId: '123' },
    });
  });

  it('implements extend', async () => {
    type ChatContext = { userId: string; cloned?: boolean };
    const chatModel = new ChatModel<ChatContext>({
      client: Client,
      context: { userId: '123' },
      params: { model: 'gpt-fake' },
      events: { onApiResponse: [() => {}] },
    });
    const clonedModel = chatModel.extend({
      context: { cloned: true },
      params: { model: 'gpt-fake-cloned' },
      events: { onApiResponse: [() => {}] },
    });
    expect(clonedModel.context).toEqual({
      userId: '123',
      cloned: true,
    });
    expect(clonedModel.params).toEqual({
      model: 'gpt-fake-cloned',
    });
    expect(clonedModel.events.onApiResponse?.length).toBe(2);
  });

  it('can cache responses', async () => {
    const apiResponseEvent = vi.fn();
    const completeEvent = vi.fn();
    const chatModel = new ChatModel({
      cache: new Map(),
      client: Client,
      params: { model: 'gpt-fake' },
      events: {
        onApiResponse: [apiResponseEvent],
        onComplete: [completeEvent],
      },
      context: { userId: '123' },
    });
    await chatModel.run({
      messages: [{ role: 'user', content: 'content' }],
    });
    expect(apiResponseEvent).toHaveBeenCalledOnce();
    expect(completeEvent).toHaveBeenCalledOnce();
    expect(Client.createChatCompletion).toHaveBeenCalledOnce();
    // Make the same request that should be cached
    await chatModel.run({
      messages: [{ role: 'user', content: 'content' }],
    });
    // onApiResponse event isn't triggered for cached responses
    expect(apiResponseEvent).toHaveBeenCalledOnce();
    // onComplete is called for cached responses
    expect(completeEvent).toHaveBeenCalledTimes(2);
    expect(Client.createChatCompletion).toHaveBeenCalledOnce();
  });

  it('can be extended', async () => {
    // Create a mocked cache (Map) to ensure that the cache is passed down
    const cache = new Map();
    const getSpy = vi.spyOn(cache, 'get');
    const onComplete1 = vi.fn();
    const onComplete2 = vi.fn();
    const onError = vi.fn();
    const onApiResponse = vi.fn();

    // Create a ChatModel instance and make a request
    const chatModel = new ChatModel({
      cache,
      client: Client,
      params: { model: 'gpt-fake' },
      context: { level: 1, userId: '123' },
      events: {
        onApiResponse: [onApiResponse],
        onComplete: [onComplete1, onComplete2],
        onError: [onError],
      },
    });
    await chatModel.run({ messages: [{ role: 'user', content: 'content2' }] });

    // Ensure the base model works as expected
    expect(getSpy).toHaveBeenCalledOnce();
    expect(onApiResponse).toHaveBeenCalledOnce();
    expect(onComplete1).toHaveBeenCalledOnce();
    expect(onComplete1).toHaveBeenCalledOnce();
    expect(onError).not.toHaveBeenCalled();
    expect(chatModel.params.model).toBe('gpt-fake');
    expect(chatModel.context).toEqual({ level: 1, userId: '123' });

    const newOnComplete = vi.fn();

    // Extend the model and make another request
    const secondChatModel = chatModel.extend({
      params: { model: 'gpt-fake-extended' },
      context: { level: 2 },
      events: { onComplete: [newOnComplete] },
    });
    await secondChatModel.run({
      messages: [{ role: 'user', content: 'content' }],
    });

    // Ensure the old model is unchanged
    expect(chatModel.params.model).toBe('gpt-fake');
    expect(chatModel.context).toEqual({ level: 1, userId: '123' });

    // Ensure the new model works as expected
    expect(onApiResponse).toHaveBeenCalledTimes(2);
    expect(onComplete1).toHaveBeenCalledTimes(2); // these are kept when extending
    expect(onComplete2).toHaveBeenCalledTimes(2); // these are kept when extending
    expect(newOnComplete).toHaveBeenCalledOnce();
    expect(onError).not.toHaveBeenCalled();
    expect(getSpy).toHaveBeenCalledTimes(2);
    expect(secondChatModel.params.model).toBe('gpt-fake-extended');
    expect(secondChatModel.context).toEqual({ level: 2, userId: '123' });

    const cache2 = new Map();
    const getSpy2 = vi.spyOn(cache2, 'get');

    // Extend again to clear properties
    const thirdChatModel = secondChatModel.extend({
      cache: cache2,
      params: { model: 'gpt-fake-extended-2' },
      context: {},
      events: {},
    });
    await thirdChatModel.run({
      messages: [{ role: 'user', content: 'content3' }],
    });

    expect(thirdChatModel.params).toEqual({ model: 'gpt-fake-extended-2' });
    expect(thirdChatModel.context).toEqual({});
    expect(thirdChatModel.events).toEqual({});

    expect(getSpy2).toHaveBeenCalledOnce();
    expect(getSpy).toHaveBeenCalledTimes(2);
    expect(newOnComplete).toHaveBeenCalledOnce();
    expect(onError).not.toHaveBeenCalled();
    expect(getSpy).toHaveBeenCalledTimes(2);
    expect(secondChatModel.params.model).toBe('gpt-fake-extended');
  });

  it(`mutating event data doesn't impact the models context and params`, async () => {
    const onComplete = vi.fn().mockImplementation((e: any) => {
      e.userId = 'mutated';
      e.params.model = 'mutated';
    });

    const chatModel = new ChatModel({
      client: Client,
      params: { model: 'gpt-fake' },
      events: { onComplete: [onComplete] },
      context: { userId: '123' },
    });
    await chatModel.run({ messages: [{ role: 'user', content: 'content2' }] });

    expect(onComplete).toHaveBeenCalledOnce();
    expect(chatModel.context.userId).toBe('123');
    expect(chatModel.params.model).toBe('gpt-fake');
  });
});
