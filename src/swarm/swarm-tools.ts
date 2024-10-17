import { z } from 'zod';

import {
  extractZodObject,
  type Msg,
  MsgUtil,
  zodToJsonSchema,
} from '../index.js';
import { getErrorMsg } from '../model/utils/errors.js';
import { cleanString } from '../model/utils/message-util.js';
import { type Agent, type SwarmFunc } from './types.js';

export function swarmFunction<Schema extends z.ZodObject<any>, Return>(
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
): SwarmFunc {
  /** Parse the arguments string, optionally reading from a message. */
  const parseArgs = (input: string | Msg) => {
    if (typeof input === 'string') {
      return extractZodObject({ schema: spec.argsSchema, json: input });
    } else if (MsgUtil.isFuncCall(input)) {
      const args = input.function_call.arguments;
      return extractZodObject({ schema: spec.argsSchema, json: args });
    } else {
      throw new Error('Invalid input type');
    }
  };

  // Call the implementation function with the parsed arguments.
  const aiFunction = async (input: string | Msg) => {
    const parsedArgs = parseArgs(input);
    const result = await implementation(parsedArgs);
    try {
      const resultStr =
        typeof result === 'string' ? result : JSON.stringify(result);
      return { value: resultStr };
    } catch (err) {
      console.error(`Error stringifying function ${spec.name} result:`, err);
      const errMsg = getErrorMsg(err);
      return {
        value: `Error stringifying function ${spec.name} result: ${errMsg}`,
      };
    }
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

/** This is a simple no-op function that can be used to transfer context to another agent. */
export function swarmHandoff(args: {
  agent: Agent;
  description?: string;
}): SwarmFunc {
  const { agent, description } = args;
  const schema = z.object({});

  /** Parse the arguments string, optionally reading from a message. */
  const parseArgs = (input: string | Msg) => {
    if (typeof input === 'string') {
      return extractZodObject({ schema, json: input });
    } else if (MsgUtil.isFuncCall(input)) {
      const args = input.function_call.arguments;
      return extractZodObject({ schema, json: args });
    } else {
      throw new Error(`Invalid input type`);
    }
  };
  const aiFunction = async () => {
    const value = `Transfered to ${agent.name}. Adopt the role and responsibilities of ${agent.name} and continue the conversation.`;
    return { value, agent };
  };

  aiFunction.parseArgs = parseArgs;
  aiFunction.argsSchema = schema;
  aiFunction.spec = {
    name: `transfer_to_${agent.name}`,
    description: description || '',
    parameters: zodToJsonSchema(schema),
  };

  return aiFunction;
}
