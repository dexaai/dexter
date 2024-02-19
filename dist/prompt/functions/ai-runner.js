import pMap from 'p-map';
import { Msg, getErrorMsg } from '../index.js';
/**
 * Creates a function to run a chat model in a loop
 * - Handles parsing, running, and inserting responses for function & tool call messages
 * - Handles errors by adding a message with the error and rerunning the model
 * - Optionally validates the content of the last message
 */
export function createAIRunner(args) {
    /** Return the content string or an empty string if null. */
    function defaultValidateContent(content) {
        return (content ?? '');
    }
    /** Break when an assistant message with content is received. */
    function defaultShouldBreakLoop(msg) {
        return msg.role === 'assistant' && msg.content !== null;
    }
    /** Execute the runner and return the messages and content of the last message. */
    return async function run(params, context) {
        const { chatModel, functions, mode = 'tools', maxIterations = 5, functionCallConcurrency, systemMessage, validateContent = defaultValidateContent, shouldBreakLoop = defaultShouldBreakLoop, } = args;
        // Add the functions/tools to the model params
        const additonalParams = getParams({ functions, mode });
        // Create a message from the input if it's a string
        const { messages, ...modelParams } = typeof params === 'string'
            ? {
                messages: [Msg.user(params)],
            }
            : params;
        if (systemMessage) {
            messages.unshift(Msg.system(systemMessage));
        }
        let iterations = 0;
        // Store the last error to return if the maxIterations is reached
        let lastError;
        // Store the last response message from the model
        let lastResponseMessage;
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
                    const content = await Promise.resolve(validateContent(lastMessage.content));
                    return { status: 'success', messages, content };
                }
            }
            catch (error) {
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
                if (lastResponseMessage && Msg.isToolCall(lastResponseMessage)) {
                    lastResponseMessage.tool_calls.forEach((toolCall) => {
                        messages.push(Msg.toolResult({
                            message: `There was an error validating the tool arguments. Please check the error message and try again with new arguments.`,
                            errorMessage: errMessage,
                        }, toolCall.id));
                    });
                }
                else {
                    messages.push(Msg.user(`There was an error validating the response. Please check the error message and try again.\nError:\n${errMessage}`));
                }
            }
        }
        // Return the last error if present, otherwise return a generic error
        if (lastError !== undefined) {
            return { status: 'error', messages, error: lastError };
        }
        else {
            const error = new Error(`Failed to get a valid response from the model after ${maxIterations} iterations.`);
            return { status: 'error', messages, error };
        }
    };
}
/** Get the chat model params for the tools or functions. */
function getParams(args) {
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
            type: 'function',
            function: func.spec,
        })),
    };
}
/**
 * Handle messages that require calling functions.
 * @returns An array of the new messages from the function calls
 * Note: Does not include args.message in the returned array
 */
export async function handleFunctionCallMessage(args) {
    const { message, functions = [], functionCallConcurrency = 8 } = args;
    const messages = [message];
    const funcMap = getFuncMap(functions);
    /** Call a function and return the result. */
    async function callFunction(args) {
        const { arguments: funcArgs, name } = args;
        const func = funcMap.get(name);
        if (!func) {
            throw new Error(`No function found with name: ${name}`);
        }
        try {
            return await func(funcArgs);
        }
        catch (err) {
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
    if (Msg.isFuncCall(message)) {
        const result = await callFunction(message.function_call);
        messages.push(Msg.funcResult(result, message.function_call.name));
    }
    // Run all the tool_calls functions and add the result messages.
    if (Msg.isToolCall(message)) {
        await pMap(message.tool_calls, async (toolCall) => {
            const result = await callFunction(toolCall.function);
            messages.push(Msg.toolResult(result, toolCall.id));
        }, { concurrency: functionCallConcurrency });
    }
    return messages.slice(1);
}
/** Create a map of function names to functions for easy lookup. */
function getFuncMap(functions) {
    return functions.reduce((map, func) => {
        map.set(func.spec.name, func);
        return map;
    }, new Map());
}
//# sourceMappingURL=ai-runner.js.map