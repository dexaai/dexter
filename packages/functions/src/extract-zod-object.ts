import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { assertError } from './assert-error.js';
import { extractJsonObject } from './extract-json.js';

/**
 * Extract an object from a JSON string and validate it against a Zod schema.
 * Returns the error message if the validation fails.
 */
export function extractZodObject<Schema extends z.ZodObject<any>>(args: {
  json: string;
  schema: Schema;
}): z.infer<Schema> | string {
  try {
    const json = extractJsonObject(args.json);
    const parsed: z.infer<Schema> = args.schema.parse(json);
    return parsed;
  } catch (error) {
    // Create a friendly error message if the error is a ZodError.
    if (error instanceof z.ZodError) {
      const { message } = fromZodError(error);
      return message;
    }
    // Otherwise, just return the error message.
    assertError(error);
    return error.message;
  }
}
