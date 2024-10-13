import { type z } from 'zod';

import {
  extractZodObject,
  type Msg,
  MsgUtil,
  zodToJsonSchema,
} from '../model/index.js';
import { cleanString } from '../model/utils/message-util.js';
import { type AIFunction } from './types.js';

/**
 * Create a function meant to be used with OpenAI tool or function calling.
 *
 * The returned function will parse the arguments string and call the
 * implementation function with the parsed arguments.
 *
 * The `spec` property of the returned function is the spec for adding the
 * function to the OpenAI API `functions` property.
 */
export function createAIFunction<Schema extends z.ZodObject<any>, Return>(
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
): AIFunction<Schema, Return> {
  /** Parse the arguments string, optionally reading from a message. */
  const parseArgs = (input: string | Msg) => {
    if (typeof input === 'string') {
      return extractZodObject({ schema: spec.argsSchema, json: input });
    } else if (MsgUtil.isFuncCall(input)) {
      const args = input.function_call.arguments;
      return extractZodObject({ schema: spec.argsSchema, json: args });
    } else {
      throw new Error(`Missing required function_call.arguments property`);
    }
  };

  // Call the implementation function with the parsed arguments.
  const aiFunction = (input: string | Msg) => {
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
