import type { ChatMessage } from 'openai-fetch';
import { OpenAIClient } from 'openai-fetch';
/** Create a new openai-fetch OpenAIClient. */
export declare function createOpenAIClient(
/** Options to pass to the OpenAI client. */
opts?: ConstructorParameters<typeof OpenAIClient>[0], 
/** Force a new client to be created. */
forceNew?: boolean): OpenAIClient;
/** Reformat name to adhere to OpenAI's naming restrictions: /^[a-zA-Z0-9_-]{1,64}$/ */
export declare function formatName<Msg extends ChatMessage>(message: Msg): Msg;
