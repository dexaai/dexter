import type { Prompt } from '../types.js';
import type { Model } from '../../index.js';
/**
 * Creates a function to run a chat model in a loop
 * - Handles parsing, running, and inserting responses for function & tool call messages
 * - Handles errors by adding a message with the error and rerunning the model
 * - Optionally validates the content of the last message
 */
export declare function createAIRunner<Content extends any = string>(args: {
    /** The ChatModel used to make API calls. */
    chatModel: Model.Chat.Model;
    /** The functions the model can call. */
    functions?: Prompt.AIFunction[];
    /** Use this to control when the runner should stop. */
    shouldBreakLoop?: (msg: Prompt.Msg) => boolean;
    /** The maximum number of iterations before the runner throws an error. An iteration is a single call to the model/API. */
    maxIterations?: number;
    /** The number of function calls to make concurrently. */
    functionCallConcurrency?: number;
    /** Parse and validate the content of the last message. */
    validateContent?: (content: string | null) => Content | Promise<Content>;
    /** Controls whether functions or tool_calls are used. */
    mode?: Prompt.Runner.Mode;
    /** Add a system message to the beginning of the messages array. */
    systemMessage?: string;
    /** Called when a retriable error occurs. */
    onRetriableError?: (error: Error) => void;
}): Prompt.Runner<Content>;
/**
 * Handle messages that require calling functions.
 * @returns An array of the new messages from the function calls
 * Note: Does not include args.message in the returned array
 */
export declare function handleFunctionCallMessage(args: {
    message: Prompt.Msg;
    functions?: Prompt.AIFunction[];
    functionCallConcurrency?: number;
}): Promise<Prompt.Msg[]>;
