import type { z } from 'zod';
import type { ChatModel } from '../index.js';
import { extractZodObject } from '../index.js';

export type Validator<T> = (input: ChatModel.Message) => Promise<T> | T;

export function validateFunctionCall<Schema extends z.ZodObject<any>>(
  schema: Schema
): Validator<z.infer<Schema>> {
  return (message: ChatModel.Message): z.infer<Schema> => {
    return extractZodObject({
      schema,
      json: message.function_call?.arguments || '',
    });
  };
}
