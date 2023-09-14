import type { z } from 'zod';
import { extractZodObject } from '@dexaai/model/utils';
import { zodToFunctionParameters } from './zod-fns.js';

/**
 * An API or function used for OpenAI function calling.
 * One or more APIs can be registered to an OpenAI request.
 */
export class Api<Schema extends z.ZodObject<any>> {
  constructor(
    public readonly name: string,
    public readonly schema: Schema,
    public readonly description?: string
  ) {}

  /** Get the OpenAPI schema for this API. */
  public get openApiSchema(): {
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
  } {
    return {
      name: this.name,
      description: this.description,
      parameters: zodToFunctionParameters(this.schema),
    };
  }

  /**
   * Parse the arguments string from `function_call.arguments`
   * Returns either the parsed arguments or an error message.
   */
  parseArgs(args: string | undefined):
    | {
        args: z.infer<Schema>;
        error: null;
      }
    | {
        args: null;
        error: string;
      } {
    if (!args) {
      return { args: null, error: 'Missing expected function_call arguments' };
    }
    const data = extractZodObject({ json: args, schema: this.schema });
    if (typeof data === 'string') {
      return { args: null, error: data };
    }
    return { args: data, error: null };
  }
}
