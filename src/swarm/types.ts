import { type z } from 'zod';

import { type Msg } from '../model/types.js';

export type CtxVal = Record<string, unknown>;

export type Agent = {
  name: string;
  model?: string;
  functions: SwarmFunc[]; // eslint-disable-line no-use-before-define
  instructions: string | ((args: CtxVal) => string);
  toolChoice?: string;
  parallelToolCalls?: boolean;
};

export type SwarmFuncResult = {
  value: string;
  agent?: Agent;
  ctx?: CtxVal;
};

export interface SwarmFunc<Schema extends z.ZodObject<any> = z.ZodObject<any>> {
  // TODO: add support for context injection
  /** The implementation of the function, with arg parsing and validation. */
  (input: string | Msg): Promise<SwarmFuncResult>;
  /** The Zod schema for the arguments string. */
  argsSchema: Schema;
  /** Parse the function arguments from a message. */
  parseArgs(input: string | Msg): z.infer<Schema>;
  /** The function spec for the OpenAI API `functions` property. */
  spec: {
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
  };
}

export type SwarmResponse = {
  messages: Msg[];
  agent: Agent;
  ctx: CtxVal;
};
