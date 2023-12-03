import type { z } from 'zod';
import type { Model } from '../../model/index.js';
import { Msg, type Prompt } from '../index.js';
import { createAIFunction } from './ai-function.js';
import { createAIRunner } from './ai-runner.js';

/**
 * Use OpenAI function calling to extract data from a message.
 */
export function createAIExtractFunction<Schema extends z.ZodObject<any>>(
  {
    chatModel,
    name,
    description,
    schema,
    maxRetries = 0,
    systemMessage,
    functionCallConcurrency,
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
    /** The number of function calls to make concurrently. */
    functionCallConcurrency?: number;
  },
  /**
   * Optional custom extraction function to call with the parsed arguments.
   *
   * This is useful for adding custom validation to the extracted data.
   */
  customExtractImplementation?: (
    params: z.infer<Schema>
  ) => z.infer<Schema> | Promise<z.infer<Schema>>
): Prompt.ExtractFunction<Schema> {
  // The AIFunction that will be used to extract the data
  const extractFunction = createAIFunction(
    {
      name,
      description,
      argsSchema: schema,
    },
    async (args): Promise<z.infer<Schema>> => {
      if (customExtractImplementation) return customExtractImplementation(args);
      else return args;
    }
  );

  // Create a runner that will call the function, validate the args and retry
  // if necessary, and return the result.
  const runner = createAIRunner({
    chatModel: chatModel.clone({
      params: {
        // @TODO: use deep partial on clone/extend input
        model: chatModel.getParams().model,
        function_call: { name },
      },
    }),
    systemMessage,
    functions: [extractFunction],
    mode: 'functions',
    maxIterations: maxRetries + 1,
    functionCallConcurrency,
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
