import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { extractZodObject } from './extract-zod-object.js';

describe('extractZodObject()', () => {
  it('extracts a valid object', () => {
    const schema = z.object({ names: z.array(z.string()) });
    expect(
      extractZodObject({
        json: `{ "names": ["Alice", "Bob"] }`,
        schema,
      })
    ).toEqual({
      names: ['Alice', 'Bob'],
    });
  });
  it('returns error message for invalid JSON', () => {
    const schema = z.object({ names: z.array(z.string()) });
    expect(() =>
      extractZodObject({
        json: `{ "names": ["Alice",`,
        schema,
      })
    ).toThrow('Unexpected end of JSON input while parsing empty string');
  });
  it('returns error message when zod validation fails', () => {
    const schema = z.object({ names: z.array(z.string()) });
    expect(() =>
      extractZodObject({
        json: `{ "names": [1] }`,
        schema,
      })
    ).toThrow(
      'Validation error: Expected string, received number at "names[0]"'
    );
  });
});
