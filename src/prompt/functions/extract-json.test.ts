import { describe, expect, it } from 'vitest';
import { extractJsonObject } from './extract-json.js';

describe('extractJsonObject()', () => {
  it('fixes single quotes', () => {
    expect(extractJsonObject(`{ "foo": 'single quotes' }`)).toEqual({
      foo: 'single quotes',
    });
  });
  it('fixes unquoted keys', () => {
    expect(extractJsonObject(`{ foo: "bar" }`)).toEqual({
      foo: 'bar',
    });
  });
  it('ignores surrounding text', () => {
    const str = `
      This is my answer:
      \`\`\`
      { "foo": "bar" }
      \`\`\`
      But I'm an LLM so I keep rambling
    `;
    expect(extractJsonObject(str)).toEqual({
      foo: 'bar',
    });
  });
});
