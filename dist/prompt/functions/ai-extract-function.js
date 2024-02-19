import { Msg } from '../index.js';
import { createAIFunction } from './ai-function.js';
import { createAIRunner } from './ai-runner.js';
/**
 * Use OpenAI function calling to extract data from a message.
 */
export function createAIExtractFunction({ chatModel, name, description, schema, maxRetries = 0, systemMessage, functionCallConcurrency, }, 
/**
 * Optional custom extraction function to call with the parsed arguments.
 *
 * This is useful for adding custom validation to the extracted data.
 */
customExtractImplementation) {
    // The AIFunction that will be used to extract the data
    const extractFunction = createAIFunction({
        name,
        description,
        argsSchema: schema,
    }, async (args) => {
        if (customExtractImplementation)
            return customExtractImplementation(args);
        else
            return args;
    });
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
        if (response.status === 'error')
            throw response.error;
        return response.content;
    };
}
//# sourceMappingURL=ai-extract-function.js.map