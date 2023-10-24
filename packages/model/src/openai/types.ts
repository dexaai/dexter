import type {
  ChatParams as OChatParams,
  ChatResponse,
  ChatStreamResponse,
  OpenAIClient,
} from 'openai-fetch';

export namespace OpenAI {
  export type Client = OpenAIClient;

  export namespace Chat {
    /** Model parameters passed to the OpenAI API. */
    export type Params = {
      messages: OChatParams['messages'];
      model: OChatParams['model'];
      frequency_penalty?: OChatParams['frequency_penalty'];
      function_call?: OChatParams['function_call'];
      functions?: OChatParams['functions'];
      logit_bias?: OChatParams['logit_bias'];
      max_tokens?: OChatParams['max_tokens'];
      presence_penalty?: OChatParams['presence_penalty'];
      stop?: OChatParams['stop'];
      temperature?: OChatParams['temperature'];
      top_p?: OChatParams['top_p'];
    };
    /** A response from the chat completion endpoint. */
    export type Response = ChatResponse;
    /** A streamed response from the chat completion endpoint. */
    export type StreamResponse = ChatStreamResponse;
  }
}
