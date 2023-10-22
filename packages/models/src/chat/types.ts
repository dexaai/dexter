import type { ChatParams, ChatResponse } from 'openai-fetch';
import type { OpenAIClient } from 'openai-fetch';
import type { Context } from '../types.js';

export type { Context };

/** Model parameters passed to the OpenAI API. */
export type ModelParams = {
  messages: ChatParams['messages'];
  model: ChatParams['model'];
  frequency_penalty?: ChatParams['frequency_penalty'];
  function_call?: ChatParams['function_call'];
  functions?: ChatParams['functions'];
  logit_bias?: ChatParams['logit_bias'];
  max_tokens?: ChatParams['max_tokens'];
  presence_penalty?: ChatParams['presence_penalty'];
  stop?: ChatParams['stop'];
  temperature?: ChatParams['temperature'];
  top_p?: ChatParams['top_p'];
};

/**
 * The parameters required to run the ChatModel.
 * Note: the ChatModel always has a model to use, so it's optional here.
 */
export type GenerateParams = Omit<ModelParams, 'model'> & {
  model?: ModelParams['model'];
};

export type EnrichedChatResponse = ChatResponse & {
  cached: boolean;
  cost?: number;
  latency: number;
};

/**
 * Called when a response is received from the OpenAI API.
 * Includes cached responses, which can be identified by the `cached` property
 * on the response.
 */
type ResponseHook = (
  params: ChatParams,
  response: EnrichedChatResponse,
  context: Context
) => Promise<void>;
/** Called when an error is thrown anywhere during execution. */
type ErrorHook = (
  params: ChatParams,
  error: unknown,
  context: Context
) => Promise<void>;
/** Hooks for the ChatModel. */
export type ChatModelHooks = {
  onResponse?: ResponseHook[];
  onError?: ErrorHook[];
};

/** Key-value store for caching chat responses. */
export type ChatCache = {
  get: (
    params: Omit<ChatParams, 'messages' | 'user'>
  ) => Promise<EnrichedChatResponse | undefined>;
  set: (
    params: Omit<ChatParams, 'messages' | 'user'>,
    response: EnrichedChatResponse
  ) => Promise<void>;
};

export type ChatModelProperties = {
  cache?: ChatCache;
  client: OpenAIClient;
  context: Context;
  params: Omit<ModelParams, 'messages'>;
  hooks: ChatModelHooks;
};

export interface IChatModel {
  generate(
    params: GenerateParams,
    context?: Context
  ): Promise<EnrichedChatResponse>;
  clone(params?: Partial<ChatModelProperties>, context?: Context): IChatModel;
}
