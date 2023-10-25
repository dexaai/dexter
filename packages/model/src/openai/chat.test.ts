import { describe, expect, it } from 'vitest';
import { getMemoryCache } from '../utils/memory-cache.js';
import { ChatModel } from './chat.js';
import type { OpenAI } from './types.js';

const FAKE_RESPONSE: OpenAI.Chat.Response = {
  id: 'fake-id',
  choices: [
    {
      index: 0,
      finish_reason: 'stop',
      message: {
        role: 'assistant',
        content: 'Hi from fake AI',
      },
    },
  ],
  created: 0,
  model: 'gpt-fake',
  object: 'fake-chat',
  usage: {
    completion_tokens: 1,
    prompt_tokens: 1,
    total_tokens: 2,
  },
};

describe('ChatModel', () => {
  let Client: OpenAI.Client;

  beforeEach(() => {
    vi.setSystemTime(new Date());
    Client = vi.fn() as unknown as OpenAI.Client;
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
    expect(response).toEqual({
      cached: false,
      cost: 0,
      message: {
        role: 'assistant',
        content: 'Hi from fake AI',
      },
      tokens: {
        prompt: 1,
        completion: 1,
        total: 2,
      },
    });
  });

  it('triggers hooks', async () => {
    const startHook = vi.fn();
    const apiResponseHook = vi.fn();
    const completeHook = vi.fn();
    const chatModel = new ChatModel({
      client: Client,
      params: { model: 'gpt-fake' },
      hooks: {
        onStart: [startHook],
        onApiResponse: [apiResponseHook],
        onComplete: [completeHook],
      },
      context: { userId: '123' },
    });
    await chatModel.run({
      messages: [{ role: 'user', content: 'content' }],
    });
    expect(startHook).toHaveBeenCalledOnce();
    expect(apiResponseHook).toHaveBeenCalledOnce();
    expect(completeHook).toHaveBeenCalledOnce();
    expect(apiResponseHook).toHaveBeenCalledWith({
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

  it('implements clone', async () => {
    const chatModel = new ChatModel({
      client: Client,
      context: { userId: '123' },
      params: { model: 'gpt-fake' },
      hooks: { onApiResponse: [() => {}] },
    });
    const clonedModel = chatModel.clone({
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
    const chatModel = new ChatModel({
      cache: getMemoryCache(),
      client: Client,
      params: { model: 'gpt-fake' },
      hooks: { onApiResponse: [apiResponseHook], onComplete: [completeHook] },
      context: { userId: '123' },
    });
    await chatModel.run({
      messages: [{ role: 'user', content: 'content' }],
    });
    expect(apiResponseHook).toHaveBeenCalledOnce();
    expect(completeHook).toHaveBeenCalledOnce();
    expect(Client.createChatCompletion).toHaveBeenCalledOnce();
    // Make the same request that should be cached
    await chatModel.run({
      messages: [{ role: 'user', content: 'content' }],
    });
    // onApiResponse hook isn't triggered for cached responses
    expect(apiResponseHook).toHaveBeenCalledOnce();
    // onComplete is called for cached responses
    expect(completeHook).toHaveBeenCalledTimes(2);
    expect(Client.createChatCompletion).toHaveBeenCalledOnce();
  });
});
