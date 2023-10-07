import type { z } from 'zod';
import { zodToJsonSchema } from './zod-fns.js';
import { extractZodObject } from './extract-zod-object.js';

/**
 * A function meant to be used with OpenAI function calling.
 */
export interface AiFunction<
  Name extends string = string,
  Schema extends z.ZodObject<any> = z.ZodObject<any>,
  Return extends any = any
> {
  /** The implementation of the function, with arg parsing and validation. */
  (args: string): Promise<Return>;
  /** The Zod schema for the arguments string. */
  schema: Schema;
  /** The function spec for the OpenAI API `functions` property. */
  spec: {
    name: Name;
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
  const Name extends string,
  Schema extends z.ZodObject<any>,
  Return extends any
>(
  spec: {
    /** Name of the function. */
    name: Name;
    /** Description of the function. */
    description?: string;
    /** Zod schema for the arguments string. */
    schema: Schema;
  },
  /** Implementation of the function to call with the parsed arguments. */
  implementation: (params: z.infer<Schema>) => Promise<Return>
): AiFunction<Name, Schema, Return> {
  // Call the implementation function with the parsed arguments.
  const func = (args: string) => {
    const parsedArgs = extractZodObject({ schema: spec.schema, json: args });
    return implementation(parsedArgs);
  };
  func.schema = spec.schema;
  func.spec = {
    name: spec.name,
    description: spec.description,
    parameters: zodToJsonSchema(spec.schema),
  };
  return func;
}
