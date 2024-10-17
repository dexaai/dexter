import { type SetOptional } from 'type-fest';
import { type z } from 'zod';

import { type Model, type Msg } from '../index.js';

/**
 * A runner that iteratively calls the model and handles function calls.
 */
export type AIRunner<Content = string> = (
  params: string | AIRunner.Params,
  context?: Model.Ctx
) => Promise<AIRunner.Response<Content>>;

export namespace AIRunner {
  /** Parameters to execute a runner */
  export type Params = SetOptional<Model.Chat.Run & Model.Chat.Config, 'model'>;

  export type ModelParams = Partial<
    Omit<Model.Chat.Run & Model.Chat.Config, 'messages' | 'functions' | 'tools'>
  >;

  /** Response from executing a runner */
  export type Response<Content = string> =
    | {
        status: 'success';
        messages: Msg[];
        content: Content;
      }
    | {
        status: 'error';
        messages: Msg[];
        error: Error;
      };

  /** Controls use of functions or tool_calls from OpenAI API */
  export type Mode = 'tools' | 'functions';
}

/**
 * A function used to extract data using OpenAI function calling.
 */
export type ExtractFunction<Schema extends z.ZodObject<any>> = (
  params: string | AIRunner.Params,
  context?: Model.Ctx
) => Promise<z.infer<Schema>>;

export interface AIFunctionSpec {
  name: string;
  description?: string;
  parameters: Record<string, unknown>;
}

/**
 * A function meant to be used with OpenAI function calling.
 */
export interface AIFunction<
  Schema extends z.ZodObject<any> = z.ZodObject<any>,
  Return = any,
> {
  /** The implementation of the function, with arg parsing and validation. */
  (input: string | Msg): Promise<Return>;
  /** The Zod schema for the arguments string. */
  argsSchema: Schema;
  /** Parse the function arguments from a message. */
  parseArgs(input: string | Msg): z.infer<Schema>;
  /** The function spec for the OpenAI API `functions` property. */
  spec: AIFunctionSpec;
}
