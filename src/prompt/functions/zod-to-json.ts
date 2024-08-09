import type { z } from 'zod';
import { zodToJsonSchema as zodToJsonSchemaImpl } from 'openai-zod-to-json-schema';
import { omit } from '../../utils/helpers.js';

/** Generate a JSON Schema from a Zod schema. */
export function zodToJsonSchema(
  schema: z.ZodType,
  {
    strict = false,
  }: {
    strict?: boolean;
  } = {}
): Record<string, unknown> {
  return omit(
    zodToJsonSchemaImpl(schema, {
      $refStrategy: 'none',
      openaiStrictMode: strict,
    }),
    '$schema',
    'default',
    'definitions',
    'description',
    'markdownDescription'
  );
}
