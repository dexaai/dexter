import type {
  ChatParams,
  ChatResponse,
  ChatStreamResponse,
  EmbeddingParams,
  EmbeddingResponse,
  OpenAIClient,
} from 'openai-fetch';

export namespace OpenAI {
  export type Client = OpenAIClient;

  export namespace Chat {
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
    /** A response from the chat completion endpoint. */
    export type Response = ChatResponse;
    /** A streamed response from the chat completion endpoint. */
    export type StreamResponse = ChatStreamResponse;
  }

  export namespace Embedding {
    export type Params = EmbeddingParams;
    /** A response from the chat completion endpoint. */
    export type Response = EmbeddingResponse;
  }
}
