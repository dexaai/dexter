import type { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Get the OpenAPI parameters spec for an OpenAI function call
 * from a Zod schema.
 */
export function zodToFunctionParameters(schema: z.ZodObject<any>) {
  const jsonSchema = zodToJsonSchema(schema, 'mySchema');
  return jsonSchema.definitions!.mySchema;
}
