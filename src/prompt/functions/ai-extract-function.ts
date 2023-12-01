import type { z } from 'zod';
import type { Model } from '../../model/index.js';
import { Msg, type Prompt } from '../index.js';
import { createAIFunction } from './ai-function.js';
import { createAIRunner } from './ai-runner.js';

/**
 * Use OpenAI function calling to extract data from a message.
 */
export function createAIExtractFunction<Schema extends z.ZodObject<any>>({
  chatModel,
  name,
  description,
  schema,
  maxRetries = 0,
  systemMessage,
}: {
  /** The ChatModel used to make API calls. */
  chatModel: Model.Chat.Model;
  /** The name of the extractor function. */
  name: string;
  /** The description of the extractor function. */
  description?: string;
  /** The Zod schema for the data to extract. */
  schema: Schema;
  /** The maximum number of times to retry the function call. */
  maxRetries?: number;
  /** Add a system message to the beginning of the messages array. */
  systemMessage?: string;
}): Prompt.ExtractFunction<Schema> {
  // The AIFunction that will be used to extract the data
  const extractFunction = createAIFunction(
    {
      name,
      description,
      argsSchema: schema,
    },
    async (args) => args
  );

  // Create a runner that will call the function, validate the args and retry
  // if necessary, and return the result.
  const runner = createAIRunner({
    chatModel,
    systemMessage,
    functions: [extractFunction],
    mode: 'functions',
    maxIterations: maxRetries + 1,
    params: {
      function_call: { name },
    },
    shouldBreakLoop: (message) => Msg.isFuncResult(message),
    validateContent: (content) => {
      return extractFunction.parseArgs(content || '');
    },
  });

  // Execute the runner and return the extracted data.
  return async function run(params, context) {
    const response = await runner(params, context);
    if (response.status === 'error') throw response.error;
    return response.content;
  };
}
