import { z } from 'zod';
import { describe, expect, it } from 'vitest';
import { zodToJsonSchema } from './zod-to-json.js';
describe('zodToJsonSchema', () => {
    it('handles basic objects', () => {
        const params = zodToJsonSchema(z.object({
            name: z.string().min(1).describe('Name of the person'),
            age: z.number().int().optional().describe('Age in years'),
        }));
        expect(params).toEqual({
            additionalProperties: false,
            type: 'object',
            required: ['name'],
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the person',
                    minLength: 1,
                },
                age: {
                    type: 'integer',
                    description: 'Age in years',
                },
            },
        });
    });
    it('handles enums and unions', () => {
        const params = zodToJsonSchema(z.object({
            name: z.string().min(1).describe('Name of the person'),
            sexEnum: z.enum(['male', 'female']),
            sexUnion: z.union([z.literal('male'), z.literal('female')]),
        }));
        expect(params).toEqual({
            additionalProperties: false,
            type: 'object',
            required: ['name', 'sexEnum', 'sexUnion'],
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the person',
                    minLength: 1,
                },
                sexEnum: {
                    type: 'string',
                    enum: ['male', 'female'],
                },
                sexUnion: {
                    type: 'string',
                    enum: ['male', 'female'],
                },
            },
        });
    });
});
//# sourceMappingURL=zod-to-json.test.js.map