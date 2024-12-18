import { describe, expect, test } from 'vitest';

import { calculateCost } from './calculate-cost.js';

describe('Calculates cost for', () => {
  test.each([
    {
      model: 'o1',
      prompt: 1_000_000,
      completion: 0,
      expected: 1_500,
    },
    {
      model: 'o1',
      prompt: 0,
      completion: 1_000_000,
      expected: 6_000,
    },
    {
      model: 'o1-2024-12-17',
      prompt: 0,
      completion: 1_000_000,
      expected: 6_000,
    },
    {
      model: 'o1-mini',
      prompt: 1_000_000,
      completion: 0,
      expected: 300,
    },
    {
      model: 'o1-mini',
      prompt: 0,
      completion: 1_000_000,
      expected: 1_200,
    },
    {
      model: 'o1-mini-2024-07-18',
      prompt: 0,
      completion: 1_000_000,
      expected: 1_200,
    },
    {
      model: 'gpt-4o',
      prompt: 1_000_000,
      completion: 0,
      expected: 250,
    },
    {
      model: 'gpt-4o',
      prompt: 0,
      completion: 1_000_000,
      expected: 1_000,
    },
    {
      model: 'gpt-4o-mini',
      prompt: 1_000_000,
      completion: 0,
      expected: 15,
    },
    {
      model: 'gpt-4o-mini',
      prompt: 0,
      completion: 1_000_000,
      expected: 60,
    },
    { model: 'gpt-4', prompt: 1000, completion: 1000, expected: 9 },
    {
      model: 'gpt-4-1106-preview',
      prompt: 1000,
      completion: 1000,
      expected: 4,
    },
    {
      model: 'gpt-4-turbo',
      prompt: 1000,
      completion: 1000,
      expected: 4,
    },
    {
      model: 'gpt-4-turbo-2024-04-09',
      prompt: 1000,
      completion: 1000,
      expected: 4,
    },
    {
      model: 'gpt-4-turbo-preview',
      prompt: 1000,
      completion: 1000,
      expected: 4,
    },
    {
      model: 'gpt-4-0125-preview',
      prompt: 1000,
      completion: 1000,
      expected: 4,
    },
    { model: 'gpt-4-0613', prompt: 1000, completion: 1000, expected: 9 },
    { model: 'gpt-4-32k', prompt: 1000, completion: 1000, expected: 18 },
    { model: 'gpt-4-32k-0613', prompt: 1000, completion: 1000, expected: 18 },
    { model: 'gpt-3.5-turbo', prompt: 1000, completion: 1000, expected: 0.2 },
    {
      model: 'gpt-3.5-turbo-0125',
      prompt: 1000,
      completion: 1000,
      expected: 0.2,
    },
    {
      model: 'gpt-3.5-turbo-1106',
      prompt: 1000,
      completion: 1000,
      expected: 0.2,
    },
    {
      model: 'gpt-3.5-turbo-0613',
      prompt: 1000,
      completion: 1000,
      expected: 0.2,
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
      model: 'text-embedding-3-small',
      prompt: 1000,
      completion: 1000,
      expected: 0.004,
    },
    {
      model: 'text-embedding-3-large',
      prompt: 1000,
      completion: 1000,
      expected: 0.026,
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
