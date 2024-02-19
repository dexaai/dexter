import type { z } from 'zod';
import type { Model } from '../../model/index.js';
import { type Prompt } from '../index.js';
/**
 * Use OpenAI function calling to extract data from a message.
 */
export declare function createAIExtractFunction<Schema extends z.ZodObject<any>>({ chatModel, name, description, schema, maxRetries, systemMessage, functionCallConcurrency, }: {
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
customExtractImplementation?: (params: z.infer<Schema>) => z.infer<Schema> | Promise<z.infer<Schema>>): Prompt.ExtractFunction<Schema>;
