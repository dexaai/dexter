import { describe, expect, it } from 'vitest';
import { AbstractModel } from './model.js';
import type { Model } from './types.js';

/** Simple class for testing */
class Test extends AbstractModel<
  any,
  { model: string },
  {
    input: string;
    requestOpts?: {
      signal?: AbortSignal;
    };
  },
  { output: string; cached: boolean }
> {
  modelType = 'completion' as Model.Type;
  modelProvider = 'custom' as Model.Provider;
  async runModel(
    params: {
      input: string;
      requestOpts?: {
        signal?: AbortSignal;
      };
    },
    context: Model.Ctx
  ): Promise<{ output: string; cached: boolean }> {
    if (params.input === 'throw error') {
      throw new Error('Test error');
    }
    return Promise.resolve({
      output: `${params.input} > AI response with context: ${JSON.stringify(
        context
      )}`,
      cached: false,
    });
  }
  extend() {
    return this;
  }
}

describe('AbstractModel', () => {
  it('can be instantiated', () => {
    const test = new Test({ params: { model: 'testmodel' }, client: false });
    expect(test.params).toEqual({
      model: 'testmodel',
    });
  });

  it('runs', async () => {
    const test = new Test({ params: { model: 'testmodel' }, client: false });
    const result = await test.run({ input: 'fooin' }, { userId: '123' });
    expect(result).toEqual({
      output: 'fooin > AI response with context: {"userId":"123"}',
      cached: false,
    });
  });

  it('triggers onStart events', async () => {
    const startEvent = vi.fn();
    const startEvent2 = vi.fn();
    const test = new Test({
      params: { model: 'testmodel' },
      client: false,
      events: {
        onStart: [startEvent, startEvent2],
      },
    });
    await test.run({ input: 'fooin' });
    expect(startEvent).toHaveBeenCalledOnce();
    expect(startEvent2).toHaveBeenCalledOnce();
  });

  it('triggers onError event', async () => {
    const errorEvent = vi.fn();
    const test = new Test({
      params: { model: 'testmodel' },
      client: false,
      events: { onError: [errorEvent] },
    });
    try {
      await test.run({ input: 'throw error' });
    } catch (e) {}
    expect(errorEvent).toHaveBeenCalledOnce();
  });

  it('can cache responses', async () => {
    const completeEvent = vi.fn();
    const testModel = new Test({
      client: false,
      cache: new Map(),
      params: { model: 'gpt-fake' },
      events: { onComplete: [completeEvent] },
      context: { userId: '123' },
    });
    await testModel.run({ input: 'foo' });
    expect(completeEvent).toHaveBeenCalledOnce();
    expect(completeEvent.mock.lastCall[0].cached).toBe(false);
    // Make the same request that should be cached
    await testModel.run({ input: 'foo' });
    // onComplete is called for cached responses
    expect(completeEvent).toHaveBeenCalledTimes(2);
    expect(completeEvent.mock.lastCall[0].cached).toBe(true);
  });

  it('can take in a signal', async () => {
    const abortController = new AbortController();
    const test = new Test({ params: { model: 'testmodel' }, client: false });
    const result = await test.run(
      {
        input: 'fooin',
        requestOpts: {
          signal: abortController.signal,
        },
      },
      { userId: '123' }
    );

    const runModelSpy = vi.spyOn(test, 'runModel');
    await test.run(
      { input: 'fooin', requestOpts: { signal: abortController.signal } },
      { userId: '123' }
    );
    expect(runModelSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        requestOpts: expect.objectContaining({
          signal: abortController.signal,
        }),
      }),
      expect.objectContaining({ userId: '123' })
    );

    expect(result).toEqual({
      output: 'fooin > AI response with context: {"userId":"123"}',
      cached: false,
    });
  });
});
