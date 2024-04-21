import type { z } from 'zod';
import { zodToJsonSchema } from './zod-to-json.js';
import { extractZodObject } from './extract-zod-object.js';
import type { Prompt } from '../types.js';
import { cleanString } from '../utils/message.js';

/**
 * Create a function meant to be used with OpenAI tool or function calling.
 *
 * The returned function will parse the arguments string and call the
 * implementation function with the parsed arguments.
 *
 * The `spec` property of the returned function is the spec for adding the
 * function to the OpenAI API `functions` property.
 */
export function createAIFunction<
  Schema extends z.ZodObject<any>,
  Return extends any,
>(
  spec: {
    /** Name of the function. */
    name: string;
    /** Description of the function. */
    description?: string;
    /** Zod schema for the arguments string. */
    argsSchema: Schema;
  },
  /** Implementation of the function to call with the parsed arguments. */
  implementation: (params: z.infer<Schema>) => Promise<Return>
): Prompt.AIFunction<Schema, Return> {
  /** Parse the arguments string, optionally reading from a message. */
  const parseArgs = (input: string | Prompt.Msg) => {
    if (typeof input === 'string') {
      return extractZodObject({ schema: spec.argsSchema, json: input });
    } else {
      const args = input.function_call?.arguments;
      if (!args) {
        throw new Error(`Missing required function_call.arguments property`);
      }
      return extractZodObject({ schema: spec.argsSchema, json: args });
    }
  };

  // Call the implementation function with the parsed arguments.
  const aiFunction = (input: string | Prompt.Msg) => {
    const parsedArgs = parseArgs(input);
    return implementation(parsedArgs);
  };

  aiFunction.parseArgs = parseArgs;
  aiFunction.argsSchema = spec.argsSchema;
  aiFunction.spec = {
    name: spec.name,
    description: cleanString(spec.description ?? ''),
    parameters: zodToJsonSchema(spec.argsSchema),
  };

  return aiFunction;
}
