import { describe, expect } from 'vitest';
import { calculateCost } from './calculate-cost.js';

describe('Calculates cost for', () => {
  test.each([
    { model: 'gpt-4', prompt: 1000, completion: 1000, expected: 9 },
    { model: 'gpt-4-0613', prompt: 1000, completion: 1000, expected: 9 },
    { model: 'gpt-4-32k', prompt: 1000, completion: 1000, expected: 18 },
    { model: 'gpt-4-32k-0613', prompt: 1000, completion: 1000, expected: 18 },
    { model: 'gpt-3.5-turbo', prompt: 1000, completion: 1000, expected: 0.35 },
    {
      model: 'gpt-3.5-turbo-0613',
      prompt: 1000,
      completion: 1000,
      expected: 0.35,
    },
    {
      model: 'gpt-3.5-turbo-16k',
      prompt: 1000,
      completion: 1000,
      expected: 0.7,
    },
    {
      model: 'gpt-3.5-turbo-16k-0613',
      prompt: 1000,
      completion: 1000,
      expected: 0.7,
    },
    { model: 'babbage-002', prompt: 1000, completion: 1000, expected: 0.08 },
    { model: 'davinci-002', prompt: 1000, completion: 1000, expected: 0.4 },
    {
      model: 'text-embedding-ada-002',
      prompt: 1000,
      completion: 1000,
      expected: 0.02,
    },
    {
      model: 'ft:gpt-3.5-turbo:my-org:custom_suffix:id',
      prompt: 1000,
      completion: 1000,
      expected: 2.8,
    },
    {
      model: 'ft:davinci-002:my-org:custom_suffix:id',
      prompt: 1000,
      completion: 1000,
      expected: 2.4,
    },
    {
      model: 'ft:babbage-002:my-org:custom_suffix:id',
      prompt: 1000,
      completion: 1000,
      expected: 0.32,
    },
    {
      model: 'ada:ft-your-org:custom-model-name-2022-02-15-04-21-04',
      prompt: 1000,
      completion: 1000,
      expected: 0.32,
    },
    {
      model: 'babbage:ft-your-org:custom-model-name-2022-02-15-04-21-04',
      prompt: 1000,
      completion: 1000,
      expected: 0.48,
    },
  ])('$model', ({ model, prompt, completion, expected }) => {
    const usage = {
      prompt_tokens: prompt,
      completion_tokens: completion,
    };
    const cost = calculateCost({ model, tokens: usage });
    expect(cost).toEqual(expected);
  });
});
