import type { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { extractJsonObject } from './extract-json.js';
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
    const json = extractJsonObject(args);
    try {
      const parsed: z.infer<Schema> = this.schema.parse(json);
      return { args: parsed, error: null };
    } catch (error) {
      const { message } = fromZodError(error as z.ZodError);
      return { args: null, error: message };
    }
  }
}
