import { z } from 'zod';
/**
 * Extract an object from a JSON string and validate it against a Zod schema.
 * Throws an error with a message optimized for GPT readability if it fails.
 */
export declare function extractZodObject<Schema extends z.ZodObject<any>>(args: {
    json: string;
    schema: Schema;
}): z.infer<Schema>;
