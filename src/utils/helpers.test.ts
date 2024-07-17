import { describe, expect, it } from 'vitest';
import { deepMerge, mergeEvents } from './helpers.js';

describe('utils.helpers', () => {
  it('deepMerge', () => {
    expect(deepMerge(undefined, {})).toEqual({});
    expect(deepMerge({}, undefined)).toEqual({});
    expect(deepMerge(undefined, undefined)).toEqual({});
    expect(deepMerge({}, { foo: true })).toEqual({ foo: true });
    // Ensure arrays are merged in a stable order
    expect(deepMerge({ foo: [1, 2, 3] }, { foo: [4, 5, 6] })).toEqual({
      foo: [1, 2, 3, 4, 5, 6],
    });
  });

  it('deepMerge tools', () => {
    expect(
      deepMerge(
        {
          foo: [
            {
              type: 'function',
              function: {
                name: 'foo',
                description: 'foo function',
                arguments: { bar: 'baz' },
              },
            },
          ],
        },
        {
          foo: [
            {
              type: 'function',
              function: {
                name: 'foo',
                description: 'foo function',
                arguments: { bar: 'baz' },
              },
            },
            {
              type: 'function',
              function: {
                name: 'foo2',
                description: 'foo function2',
                arguments: { bar: 'baz2' },
              },
            },
          ],
        }
      )
    ).toEqual({
      foo: [
        {
          type: 'function',
          function: {
            name: 'foo',
            description: 'foo function',
            arguments: { bar: 'baz' },
          },
        },
        {
          type: 'function',
          function: {
            name: 'foo2',
            description: 'foo function2',
            arguments: { bar: 'baz2' },
          },
        },
      ],
    });
  });

  it('mergeEvents', () => {
    expect(mergeEvents(undefined, {})).toEqual({});
    expect(mergeEvents({}, undefined)).toEqual({});
    expect(mergeEvents(undefined, undefined)).toEqual({});
    expect(mergeEvents({}, { foo: true })).toEqual({ foo: true });
    // Ensure duplicates are removed from event arrays and ordering remains stable
    expect(
      mergeEvents({ foo: [1, 2, 2, 3] }, { foo: [0, 4, 3, 5, 2, 6] })
    ).toEqual({
      foo: [1, 2, 3, 0, 4, 5, 6],
    });
    expect(
      mergeEvents(
        { foo: [console.debug, console.log] },
        { foo: [console.warn, console.debug, console.log] }
      )
    ).toEqual({
      foo: [console.debug, console.log, console.warn],
    });
  });
});
