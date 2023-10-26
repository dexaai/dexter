import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { extractJsonObject } from './extract-json.js';

/**
 * Extract an object from a JSON string and validate it against a Zod schema.
 * Throws an error with a message optimized for GPT readability if it fails.
 */
export function extractZodObject<Schema extends z.ZodObject<any>>(args: {
  json: string;
  schema: Schema;
}): z.infer<Schema> {
  try {
    const json = extractJsonObject(args.json);
    const parsed: z.infer<Schema> = args.schema.parse(json);
    return parsed;
  } catch (error) {
    // Zod error messages are too verbose and confuse the model. This creates
    // an error with a more readable message.
    if (error instanceof z.ZodError) {
      throw fromZodError(error);
    }
    throw error;
  }
}
