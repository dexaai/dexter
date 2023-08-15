import { z } from 'zod';
import { describe, expect, it } from 'vitest';
import { Api } from './api.js';

const schema = z.object({
  name: z.string().min(1),
  age: z.number().int().optional(),
});

describe('API', () => {
  it('generates an OpenAPI schema', () => {
    const api = new Api('test_api', schema, 'A test API');
    expect(api.openApiSchema).toEqual({
      name: 'test_api',
      description: 'A test API',
      parameters: {
        additionalProperties: false,
        properties: {
          age: {
            type: 'integer',
          },
          name: {
            minLength: 1,
            type: 'string',
          },
        },
        required: ['name'],
        type: 'object',
      },
    });
  });
  it('parses an arguments string', () => {
    const api = new Api('test_api', schema, 'A test API');
    expect(api.parseArgs('{ "name": "bill" }')).toEqual({
      args: { name: 'bill' },
      error: null,
    });
  });
  it('returns an error for invalid arguments', () => {
    const api = new Api('test_api', schema, 'A test API');
    const resp = api.parseArgs('{}');
    expect(resp.args).toBeNull();
    expect(resp.error).not.toBeNull();
  });
});
