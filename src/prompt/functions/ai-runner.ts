import pMap from 'p-map';

import { MsgUtil } from '../../model/index.js';
import { type Model, type Msg } from '../../model/types.js';
import { getErrorMsg } from '../../model/utils/errors.js';
import { type AIFunction, type Runner } from '../types.js';

/**
 * Creates a function to run a chat model in a loop
 * - Handles parsing, running, and inserting responses for function & tool call messages
 * - Handles errors by adding a message with the error and rerunning the model
 * - Optionally validates the content of the last message
 */
export function createAIRunner<Content = string>(args: {
  /** The ChatModel used to make API calls. */
  chatModel: Model.Chat.Model;
  /** The functions the model can call. */
  functions?: AIFunction[];
  /** Use this to control when the runner should stop. */
  shouldBreakLoop?: (msg: Msg) => boolean;
  /** The maximum number of iterations before the runner throws an error. An iteration is a single call to the model/API. */
  maxIterations?: number;
  /** The number of function calls to make concurrently. */
  functionCallConcurrency?: number;
  /** Parse and validate the content of the last message. */
  validateContent?: (content: string | null) => Content | Promise<Content>;
  /** Controls whether functions or tool_calls are used. */
  mode?: Runner.Mode;
  /** Add a system message to the beginning of the messages array. */
  systemMessage?: string;
  /** Called when a retriable error occurs. */
  onRetriableError?: (error: Error) => void;
}): Runner<Content> {
  /** Return the content string or an empty string if null. */
  function defaultValidateContent(content: string | null): Content {
    return (content ?? '') as Content;
  }

  /** Break when an assistant message with content is received. */
  function defaultShouldBreakLoop(msg: Msg): boolean {
    return msg.role === 'assistant' && msg.content !== null;
  }

  /** Execute the runner and return the messages and content of the last message. */
  return async function run(params, context) {
    const {
      chatModel,
      functions,
      mode = 'tools',
      maxIterations = 5,
      functionCallConcurrency,
      systemMessage,
      validateContent = defaultValidateContent,
      shouldBreakLoop = defaultShouldBreakLoop,
    } = args;

    // Add the functions/tools to the model params
    const additonalParams = getParams({ functions, mode });

    // Create a message from the input if it's a string
    const { messages, ...modelParams }: Model.Chat.Run =
      typeof params === 'string'
        ? {
            messages: [MsgUtil.user(params)],
          }
        : params;
    if (systemMessage) {
      messages.unshift(MsgUtil.system(systemMessage));
    }

    let iterations = 0;

    // Store the last error to return if the maxIterations is reached
    let lastError: unknown | undefined;

    // Store the last response message from the model
    let lastResponseMessage: Msg | undefined;

    // Iterate until the shouldBreakLoop function returns true or the maxIterations
    // is reached
    while (iterations < maxIterations) {
      iterations++;

      try {
        // Run the model with the current messages and functions/tools
        const runParams = {
          ...modelParams,
          ...additonalParams,
          messages,
        };
        const { message } = await chatModel.run(runParams, context);
        lastResponseMessage = message;
        messages.push(message);

        // Run functions from tool/function call messages and append the new messages
        const newMessages = await handleFunctionCallMessage({
          message,
          functions,
          functionCallConcurrency,
        });
        messages.push(...newMessages);

        // Check if the last message should break the loop
        const lastMessage = messages[messages.length - 1];
        if (shouldBreakLoop(lastMessage)) {
          const content = await Promise.resolve(
            validateContent(lastMessage.content || null)
          );
          return { status: 'success', messages, content };
        }
      } catch (error: any) {
        // Halt the runner and return an error if the error is an AbortError
        if (error.name === 'AbortError') {
          return { status: 'error', messages, error };
        }

        // Update the last error
        lastError = error;

        // Call the onRetriableError callback if provided
        args.onRetriableError?.(error);

        // Otherwise, create a message with the error and continue iterating,
        // with special handling for tool_calls errors that must be followed
        // by a tools message.
        const errMessage = getErrorMsg(error);
        if (lastResponseMessage && MsgUtil.isToolCall(lastResponseMessage)) {
          lastResponseMessage.tool_calls.forEach((toolCall) => {
            messages.push(
              MsgUtil.toolResult(
                {
                  message: `There was an error validating the tool arguments. Please check the error message and try again with new arguments.`,
                  errorMessage: errMessage,
                },
                toolCall.id
              )
            );
          });
        } else {
          messages.push(
            MsgUtil.user(
              `There was an error validating the response. Please check the error message and try again.\nError:\n${errMessage}`
            )
          );
        }
      }
    }

    // Return the last error if present, otherwise return a generic error
    if (lastError !== undefined) {
      return { status: 'error', messages, error: lastError };
    } else {
      const error = new Error(
        `Failed to get a valid response from the model after ${maxIterations} iterations.`
      );
      return { status: 'error', messages, error };
    }
  };
}

/** Get the chat model params for the tools or functions. */
function getParams(args: {
  functions?: AIFunction[];
  mode: Runner.Mode;
}): Pick<Model.Chat.Config, 'functions' | 'tools'> {
  const { functions } = args;
  // Return an empty object if there are no functions
  if (!functions?.length) {
    return {};
  }

  // Use the functions mode if explicitly set
  if (args.mode === 'functions') {
    return { functions: functions.map((func) => func.spec) };
  }

  // Otherwise, default to the tools mode
  return {
    tools: functions.map((func) => ({
      type: 'function' as const,
      function: func.spec,
    })),
  };
}

/**
 * Handle messages that require calling functions.
 * @returns An array of the new messages from the function calls
 * Note: Does not include args.message in the returned array
 */
export async function handleFunctionCallMessage(args: {
  message: Msg;
  functions?: AIFunction[];
  functionCallConcurrency?: number;
}): Promise<Msg[]> {
  const { message, functions = [], functionCallConcurrency = 8 } = args;
  const messages: Msg[] = [message];
  const funcMap = getFuncMap(functions);

  /** Call a function and return the result. */
  async function callFunction(args: { name: string; arguments: string }) {
    const { arguments: funcArgs, name } = args;
    const func = funcMap.get(name);
    if (!func) {
      throw new Error(`No function found with name: ${name}`);
    }

    try {
      return await func(funcArgs);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err;
      }

      // Augment any function errors with the name of the function
      throw new Error(`Error running function "${name}": ${err.message}`, {
        cause: err,
      });
    }
  }

  // Run the function with the given name and arguments and add the result messages.
  if (MsgUtil.isFuncCall(message)) {
    const result = await callFunction(message.function_call);
    messages.push(MsgUtil.funcResult(result, message.function_call.name));
  }

  // Run all the tool_calls functions and add the result messages.
  if (MsgUtil.isToolCall(message)) {
    await pMap(
      message.tool_calls,
      async (toolCall) => {
        const result = await callFunction(toolCall.function);
        messages.push(MsgUtil.toolResult(result, toolCall.id));
      },
      { concurrency: functionCallConcurrency }
    );
  }

  return messages.slice(1);
}

/** Create a map of function names to functions for easy lookup. */
function getFuncMap(functions: AIFunction[]) {
  return functions.reduce((map, func) => {
    map.set(func.spec.name, func);
    return map;
  }, new Map<string, AIFunction>());
}
