import type {
  ChatParams,
  ChatResponse,
  ChatStreamResponse,
  CompletionParams,
  CompletionResponse,
  EmbeddingParams,
  EmbeddingResponse,
  OpenAIClient,
} from 'openai-fetch';

export namespace OpenAI {
  export type Client = OpenAIClient;

  /** OpenAI chat completion endpoint. */
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
    /** Response from the OpenAI API. */
    export type Response = ChatResponse;
    /** Streaming response from the OpenAI API. */
    export type StreamResponse = ChatStreamResponse;
  }

  /** OpenAI text embedding endpoint. */
  export namespace Embedding {
    /** Model parameters passed to the OpenAI API. */
    export type Params = EmbeddingParams;
    /** Response from the OpenAI API. */
    export type Response = EmbeddingResponse;
  }

  /** OpenAI (legacy) text completion endpoint. */
  export namespace Completion {
    /** Model parameters passed to the OpenAI API. */
    export type Params = CompletionParams;
    /** Response from the OpenAI API. */
    export type Response = CompletionResponse;
  }
}
