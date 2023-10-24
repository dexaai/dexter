import type { z } from 'zod';
import { zodToJsonSchema } from './zod-fns.js';
import { extractZodObject } from './extract-zod-object.js';
import type { ChatModel } from '../index.js';

/**
 * A function meant to be used with OpenAI function calling.
 */
export interface AiFunction<
  Schema extends z.ZodObject<any> = z.ZodObject<any>,
  Return extends any = any
> {
  /** The implementation of the function, with arg parsing and validation. */
  (input: string | ChatModel.Message): Promise<Return>;
  /** The Zod schema for the arguments string. */
  argsSchema: Schema;
  /** Parse the function arguments from a message. */
  parseArgs(input: string | ChatModel.Message): z.infer<Schema>;
  /** The function spec for the OpenAI API `functions` property. */
  spec: {
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
  };
}

/**
 * Create a function meant to be used with OpenAI function calling.
 *
 * The returned function will parse the arguments string and call the
 * implementation function with the parsed arguments.
 *
 * The `spec` property of the returned function is the spec for adding the
 * function to the OpenAI API `functions` property.
 */
export function createAiFunction<
  Schema extends z.ZodObject<any>,
  Return extends any
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
): AiFunction<Schema, Return> {
  /** Parse the arguments string, optionally reading from a message. */
  const parseArgs = (input: string | ChatModel.Message) => {
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
  const func = (input: string | ChatModel.Message) => {
    const parsedArgs = parseArgs(input);
    return implementation(parsedArgs);
  };

  func.parseArgs = parseArgs;
  func.argsSchema = spec.argsSchema;
  func.spec = {
    name: spec.name,
    description: spec.description,
    parameters: zodToJsonSchema(spec.argsSchema),
  };

  return func;
}
