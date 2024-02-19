import type { z } from 'zod';
import type { Prompt } from '../types.js';
/**
 * Create a function meant to be used with OpenAI tool or function calling.
 *
 * The returned function will parse the arguments string and call the
 * implementation function with the parsed arguments.
 *
 * The `spec` property of the returned function is the spec for adding the
 * function to the OpenAI API `functions` property.
 */
export declare function createAIFunction<Schema extends z.ZodObject<any>, Return extends any>(spec: {
    /** Name of the function. */
    name: string;
    /** Description of the function. */
    description?: string;
    /** Zod schema for the arguments string. */
    argsSchema: Schema;
}, 
/** Implementation of the function to call with the parsed arguments. */
implementation: (params: z.infer<Schema>) => Promise<Return>): Prompt.AIFunction<Schema, Return>;
