import type { z } from 'zod';
/** Generate a JSON Schema from a Zod schema. */
export declare function zodToJsonSchema(schema: z.ZodType): Record<string, unknown>;
