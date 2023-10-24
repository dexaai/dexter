import type { ChatMessage, ChatParams, ChatResponse } from 'openai-fetch';
import type { OpenAIClient } from 'openai-fetch';
import type { Models } from '../types.js';

export interface ChatModel {
  generate(
    params: ChatModel.GenerateParams,
    context?: ChatModel.Context
  ): Promise<ChatModel.EnrichedResponse>;
  clone(
    params?: Partial<ChatModel.Properties>,
    context?: ChatModel.Context
  ): ChatModel;
}

export namespace ChatModel {
  export type Message = ChatMessage;
  export type Context = Models.Context;

  /** Model parameters passed to the OpenAI API. */
  export type Params = {
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
  export type GenerateParams = Omit<Params, 'model'> & {
    model?: Params['model'];
  };

  /** The model's response, enriched with additional information. */
  export type EnrichedResponse = ChatResponse & {
    cached: boolean;
    cost?: number;
    latency: number;
  };

  type StartHook = (params: ChatParams, context: Context) => Promise<void>;
  /**
   * Called when a response is received from the OpenAI API.
   * Includes cached responses, which can be identified by the `cached` property
   * on the response.
   */
  type CompleteHook = (
    params: ChatParams,
    response: EnrichedResponse,
    context: Context
  ) => Promise<void>;
  /** Called when an error is thrown anywhere during execution. */
  type ErrorHook = (
    params: ChatParams,
    error: unknown,
    context: Context
  ) => Promise<void>;
  /** Hooks for the ChatModel. */
  export type Hooks = {
    /** Runs before the request is sent. */
    onStart?: StartHook[];
    /** Runs after the request has completed. */
    onComplete?: CompleteHook[];
    /** Runs before throwing an error. */
    onError?: ErrorHook[];
  };

  /** Key-value store for caching chat responses. */
  export type Cache = {
    get: (
      params: Omit<ChatParams, 'messages' | 'user'>
    ) => Promise<EnrichedResponse | undefined>;
    set: (
      params: Omit<ChatParams, 'messages' | 'user'>,
      response: EnrichedResponse
    ) => Promise<void>;
  };

  export type Properties = {
    cache?: Cache;
    client: OpenAIClient;
    context: Context;
    params: Omit<Params, 'messages'>;
    hooks: Hooks;
  };
}
