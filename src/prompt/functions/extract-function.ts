import type { z } from 'zod';
import { createAIFunction, Msg, type Model, type Prompt } from '../../index.js';
import { createRunner } from './runner.js';

/**
 * Use OpenAI function calling to extract data from a message.
 */
export function createExtractFunction<Schema extends z.ZodObject<any>>(args: {
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
      name: args.name,
      description: args.description,
      argsSchema: args.schema,
    },
    async (args) => args
  );

  // Create a runner that will call the function, validate the args and retry
  // if necessary, and return the result.
  const runner = createRunner({
    chatModel: args.chatModel,
    systemMessage: args.systemMessage,
    functions: [extractFunction],
    mode: 'functions',
    shouldBreakLoop: (message) => Msg.isFuncResult(message),
    maxIterations: (args.maxRetries || 0) + 1,
    validateContent: (content) => {
      return extractFunction.parseArgs(content || '');
    },
  });

  // Execute the runner and return the extracted data.
  return async function run(params, content) {
    const response = await runner(params, content);
    if (response.status === 'error') throw response.error;
    return response.content;
  };
}
