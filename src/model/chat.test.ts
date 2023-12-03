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
    const chatModel = new ChatModel({
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
});
