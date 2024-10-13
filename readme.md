<p>
  <a href="https://www.npmjs.com/package/@dexaai/dexter"><img alt="NPM" src="https://img.shields.io/npm/v/@dexaai/dexter.svg" /></a>
  <a href="https://github.com/dexaai/dexter/actions/workflows/test.yml"><img alt="Build Status" src="https://github.com/dexaai/dexter/actions/workflows/main.yml/badge.svg" /></a>
  <a href="https://github.com/dexaai/dexter/blob/main/license"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <a href="https://prettier.io"><img alt="Prettier Code Formatting" src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg" /></a>
</p>

# Dexter

Dexter is a powerful TypeScript library for working with Large Language Models (LLMs), with a focus on real-world Retrieval-Augmented Generation (RAG) applications. It provides a set of tools and utilities to interact with various AI models, manage caching, handle embeddings, and implement AI functions.

## Features

- **Comprehensive Model Support**: Implementations for Chat, Completion, Embedding, and Sparse Vector models, with efficient OpenAI API integration via `openai-fetch`.

- **Advanced AI Function Utilities**: Tools for creating and managing AI functions, including `createAIFunction`, `createAIExtractFunction`, and `createAIRunner`, with Zod integration for schema validation.

- **Flexible Caching and Tokenization**: Built-in caching system with custom cache support, and advanced tokenization based on `tiktoken` for accurate token management.

- **Robust Observability and Control**: Customizable telemetry system, comprehensive event hooks, and specialized error handling for enhanced monitoring and control.

- **Performance Optimization**: Built-in support for batching, throttling, and streaming, optimized for handling large-scale operations and real-time responses.

- **TypeScript-First and Environment Flexible**: Fully typed for excellent developer experience, with minimal dependencies and compatibility across Node.js 18+, Deno, Cloudflare Workers, and Vercel edge functions.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Repository Structure](#repository-structure)
- [API Reference](#api-reference)
  - [ChatModel](#chatmodel)
  - [CompletionModel](#completionmodel)
  - [EmbeddingModel](#embeddingmodel)
  - [SparseVectorModel](#sparsevectormodel)
  - [AI Functions](#ai-functions)
  - [Utilities](#utilities)
- [Advanced Topics](#advanced-topics)
  - [OpenAI Client (openai-fetch)](#openai-client-openai-fetch)
  - [Message Types and MsgUtil](#message-types-and-msgutil)
  - [Telemetry](#telemetry)
  - [Caching](#caching)
  - [Tokenization](#tokenization)
  - [Model Event Hooks](#model-event-hooks)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install Dexter, use your preferred package manager:

```bash
npm install @dexaai/dexter
```

This package requires `node >= 18` or an environment with `fetch` support.

This package exports [ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If your project uses CommonJS, consider switching to ESM or use the [dynamic `import()`](https://v8.dev/features/dynamic-import) function.

## Usage

Here's a basic example of how to use the ChatModel:

```typescript
import { ChatModel } from '@dexaai/dexter';

const chatModel = new ChatModel({
  params: { model: 'gpt-3.5-turbo' },
});

async function main() {
  const response = await chatModel.run({
    messages: [{ role: 'user', content: 'Tell me a short joke' }],
  });
  console.log(response.message.content);
}

main().catch(console.error);
```

## Examples

### Chat Completion with Streaming

```typescript
import { ChatModel, MsgUtil } from '@dexaai/dexter';

const chatModel = new ChatModel({
  params: { model: 'gpt-4' },
});

async function main() {
  const response = await chatModel.run({
    messages: [MsgUtil.user('Write a short story about a robot learning to love')],
    handleUpdate: (chunk) => {
      process.stdout.write(chunk);
    },
  });
  console.log('\n\nFull response:', response.message.content);
}

main().catch(console.error);
```

### Using AI Functions

```typescript
import { ChatModel, createAIFunction, MsgUtil } from '@dexaai/dexter';
import { z } from 'zod';

const getWeather = createAIFunction(
  {
    name: 'get_weather',
    description: 'Gets the weather for a given location',
    argsSchema: z.object({
      location: z.string().describe('The city and state e.g. San Francisco, CA'),
      unit: z.enum(['c', 'f']).optional().default('f').describe('The unit of temperature to use'),
    }),
  },
  async ({ location, unit }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      location,
      unit,
      temperature: Math.floor(Math.random() * 30) + 10,
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
    };
  }
);

const chatModel = new ChatModel({
  params: {
    model: 'gpt-4',
    tools: [{ type: 'function', function: getWeather.spec }],
  },
});

async function main() {
  const response = await chatModel.run({
    messages: [MsgUtil.user('What\'s the weather like in New York?')],
  });
  console.log(response.message);
}

main().catch(console.error);
```

### Embedding Generation

```typescript
import { EmbeddingModel } from '@dexaai/dexter';

const embeddingModel = new EmbeddingModel({
  params: { model: 'text-embedding-ada-002' },
});

async function main() {
  const response = await embeddingModel.run({
    input: ['Hello, world!', 'How are you?'],
  });
  console.log(response.embeddings);
}

main().catch(console.error);
```

## Repository Structure

The Dexter library is organized into the following main directories:

- `src/`: Contains the source code for the library
  - `model/`: Core model implementations and utilities
  - `ai-function/`: AI function creation and handling
- `examples/`: Contains example scripts demonstrating library usage
- `dist/`: Contains the compiled JavaScript output (generated after build)

Key files:

- `src/model/chat.ts`: Implementation of the ChatModel
- `src/model/completion.ts`: Implementation of the CompletionModel
- `src/model/embedding.ts`: Implementation of the EmbeddingModel
- `src/model/sparse-vector.ts`: Implementation of the SparseVectorModel
- `src/ai-function/ai-function.ts`: AI function creation utilities
- `src/model/utils/`: Various utility functions and helpers

## API Reference

### ChatModel

The `ChatModel` class is used for interacting with chat-based language models.

#### Constructor

```typescript
new ChatModel(args?: ChatModelArgs<CustomCtx>)
```

- `args`: Optional configuration object
  - `params`: Model parameters (e.g., `model`, `temperature`)
  - `client`: Custom OpenAI client (optional)
  - `cache`: Cache implementation (optional)
  - `context`: Custom context object (optional)
  - `events`: Event handlers (optional)
  - `debug`: Enable debug logging (optional)

#### Methods

- `run(params: ChatModelRun, context?: CustomCtx): Promise<ChatModelResponse>`
  - Executes the chat model with the given parameters and context
- `extend(args?: PartialChatModelArgs<CustomCtx>): ChatModel<CustomCtx>`
  - Creates a new instance of the model with modified configuration

### CompletionModel

The `CompletionModel` class is used for text completion tasks.

#### Constructor

```typescript
new CompletionModel(args?: CompletionModelArgs<CustomCtx>)
```

- `args`: Optional configuration object (similar to ChatModel)

#### Methods

- `run(params: CompletionModelRun, context?: CustomCtx): Promise<CompletionModelResponse>`
  - Executes the completion model with the given parameters and context
- `extend(args?: PartialCompletionModelArgs<CustomCtx>): CompletionModel<CustomCtx>`
  - Creates a new instance of the model with modified configuration

### EmbeddingModel

The `EmbeddingModel` class is used for generating embeddings from text.

#### Constructor

```typescript
new EmbeddingModel(args?: EmbeddingModelArgs<CustomCtx>)
```

- `args`: Optional configuration object (similar to ChatModel)

#### Methods

- `run(params: EmbeddingModelRun, context?: CustomCtx): Promise<EmbeddingModelResponse>`
  - Generates embeddings for the given input texts
- `extend(args?: PartialEmbeddingModelArgs<CustomCtx>): EmbeddingModel<CustomCtx>`
  - Creates a new instance of the model with modified configuration

### SparseVectorModel

The `SparseVectorModel` class is used for generating sparse vector representations.

#### Constructor

```typescript
new SparseVectorModel(args: SparseVectorModelArgs<CustomCtx>)
```

- `args`: Configuration object
  - `serviceUrl`: URL of the SPLADE service (required)
  - Other options similar to ChatModel

#### Methods

- `run(params: SparseVectorModelRun, context?: CustomCtx): Promise<SparseVectorModelResponse>`
  - Generates sparse vector representations for the given input texts
- `extend(args?: PartialSparseVectorModelArgs<CustomCtx>): SparseVectorModel<CustomCtx>`
  - Creates a new instance of the model with modified configuration

### AI Functions

#### createAIFunction

Creates a function meant to be used with OpenAI tool or function calling.

```typescript
createAIFunction<Schema extends z.ZodObject<any>, Return>(
  spec: {
    name: string;
    description?: string;
    argsSchema: Schema;
  },
  implementation: (params: z.infer<Schema>) => Promise<Return>
): AIFunction<Schema, Return>
```

#### createAIExtractFunction

Creates a function to extract structured data from text using OpenAI function calling.

```typescript
createAIExtractFunction<Schema extends z.ZodObject<any>>(
  {
    chatModel: Model.Chat.Model;
    name: string;
    description?: string;
    schema: Schema;
    maxRetries?: number;
    systemMessage?: string;
    functionCallConcurrency?: number;
  },
  customExtractImplementation?: (params: z.infer<Schema>) => z.infer<Schema> | Promise<z.infer<Schema>>
): ExtractFunction<Schema>
```

#### createAIRunner

Creates a function to run a chat model in a loop, handling parsing, running, and inserting responses for function & tool call messages.

```typescript
createAIRunner<Content = string>(args: {
  chatModel: Model.Chat.Model;
  functions?: AIFunction[];
  shouldBreakLoop?: (msg: Msg) => boolean;
  maxIterations?: number;
  functionCallConcurrency?: number;
  validateContent?: (content: string | null) => Content | Promise<Content>;
  mode?: Runner.Mode;
  systemMessage?: string;
  onRetriableError?: (error: Error) => void;
}): Runner<Content>
```

### Utilities

#### MsgUtil

Utility class for creating and checking message types.

- `MsgUtil.system(content: string, opts?): Msg.System`
- `MsgUtil.user(content: string, opts?): Msg.User`
- `MsgUtil.assistant(content: string, opts?): Msg.Assistant`
- `MsgUtil.funcCall(function_call: { name: string; arguments: string }, opts?): Msg.FuncCall`
- `MsgUtil.funcResult(content: Jsonifiable, name: string): Msg.FuncResult`
- `MsgUtil.toolCall(tool_calls: Msg.Call.Tool[], opts?): Msg.ToolCall`
- `MsgUtil.toolResult(content: Jsonifiable, tool_call_id: string, opts?): Msg.ToolResult`

#### Tokenizer

Utility for encoding, decoding, and counting tokens for various models.

- `createTokenizer(model: string): Tokenizer`

#### Cache

Utilities for caching model responses.

- `type CacheStorage<KeyType, ValueType>`
- `type CacheKey<Params extends Record<string, any>, KeyType = string>`
- `defaultCacheKey<Params extends Record<string, any>>(params: Params): string`

## Advanced Topics

### OpenAI Client (openai-fetch)

Dexter uses the `openai-fetch` library to interact with the OpenAI API. This client is lightweight, well-typed, and provides a simple interface for making API calls. Here's how it's used in Dexter:

1. **Default Client**: By default, Dexter creates an instance of `OpenAIClient` from `openai-fetch` when initializing models.

2. **Custom Client**: You can provide your own instance of `OpenAIClient` when creating a model:

   ```typescript
   import { OpenAIClient } from 'openai-fetch';
   import { ChatModel } from '@dexaai/dexter';

   const client = new OpenAIClient({ apiKey: 'your-api-key' });
   const chatModel = new ChatModel({ client });
   ```

3. **Client Caching**: Dexter implements caching for `OpenAIClient` instances to improve performance when creating multiple models with the same configuration.

4. **Streaming Support**: The `openai-fetch` client supports streaming responses, which Dexter utilizes for real-time output in chat models.

### Message Types and MsgUtil

Dexter defines a set of message types (`Msg`) that closely align with the OpenAI API's message formats but with some enhancements for better type safety and easier handling. The `MsgUtil` class provides methods for creating, checking, and asserting these message types.

#### Msg Types

- `Msg.System`: System messages
- `Msg.User`: User messages
- `Msg.Assistant`: Assistant messages
- `Msg.Refusal`: Refusal messages (thrown as errors in Dexter)
- `Msg.FuncCall`: Function call messages
- `Msg.FuncResult`: Function result messages
- `Msg.ToolCall`: Tool call messages
- `Msg.ToolResult`: Tool result messages

These types are designed to be compatible with the `ChatMessage` type from `openai-fetch`, with some differences:

- Dexter throws a `RefusalError` for refusal messages instead of including them in the `Msg` union.
- The `content` property is always defined (string or null) in Dexter's types.

#### MsgUtil Methods

1. Creation Methods:
   - `system`, `user`, `assistant`, `funcCall`, `funcResult`, `toolCall`, `toolResult`

2. Type Checking Methods:
   - `isSystem`, `isUser`, `isAssistant`, `isRefusal`, `isFuncCall`, `isFuncResult`, `isToolCall`, `isToolResult`

3. Type Assertion Methods:
   - `assertSystem`, `assertUser`, `assertAssistant`, `assertRefusal`, `assertFuncCall`, `assertFuncResult`, `assertToolCall`, `assertToolResult`

4. Conversion Method:
   - `fromChatMessage`: Converts an `openai-fetch` `ChatMessage` to a Dexter `Msg` type

### Telemetry

Dexter includes a telemetry system for tracking and logging model operations. The telemetry system is based on the OpenTelemetry standard and can be integrated with various observability platforms.

1. **Default Telemetry**: By default, Dexter uses a no-op telemetry provider that doesn't perform any actual logging or tracing.

2. **Custom Telemetry**: You can provide your own telemetry provider when initializing models. The provider should implement the `Telemetry.Provider` interface:

   ```typescript
   interface Provider {
     startSpan<T>(options: SpanOptions, callback: (span: Span) => T): T;
     setTags(tags: { [key: string]: Primitive }): void;
   }
   ```

3. **Span Attributes**: Dexter automatically adds various attributes to telemetry spans, including model type, provider, input tokens, output tokens, and more.

4. **Usage**: Telemetry is used internally in the `AbstractModel` class to wrap the `run` method, providing insights into model execution.

### Caching

Dexter provides a flexible caching system to improve performance and reduce API calls:

1. **Cache Interface**: The cache must implement the `CacheStorage` interface:

   ```typescript
   interface CacheStorage<KeyType, ValueType> {
     get: (key: KeyType) => Promise<ValueType | undefined> | ValueType | undefined;
     set: (key: KeyType, value: ValueType) => Promise<unknown> | unknown;
   }
   ```

2. **Default Cache Key**: Dexter uses a default cache key function that creates a SHA512 hash of the input parameters.

3. **Custom Cache**: You can provide your own cache implementation when initializing models:

   ```typescript
   import { ChatModel } from '@dexaai/dexter';

   const customCache = new Map();
   const chatModel = new ChatModel({ cache: customCache });
   ```

4. **Cache Usage**: Caching is automatically applied in the `AbstractModel` class. Before making an API call, it checks the cache for a stored response. After receiving a response, it stores it in the cache for future use.

5. **Cache Invalidation**: Cache invalidation is left to the user. You can implement your own cache invalidation strategy based on your specific use case.

### Tokenization

Dexter includes a tokenization system based on the `tiktoken` library, which is used by OpenAI for their models. This system is crucial for accurately counting tokens and managing model inputs and outputs.

1. **Tokenizer Creation**: The `createTokenizer` function creates a `Tokenizer` instance for a specific model:

   ```typescript
   const tokenizer = createTokenizer('gpt-3.5-turbo');
   ```

2. **Tokenizer Methods**:
   - `encode(text: string): Uint32Array`: Encodes text to tokens
   - `decode(tokens: number[] | Uint32Array): string`: Decodes tokens to text
   - `countTokens(input?: string | ChatMessage | ChatMessage[]): number`: Counts tokens in various input formats
   - `truncate({ text: string, max: number, from?: 'start' | 'end' }): string`: Truncates text to a maximum number of tokens

3. **Model Integration**: Each model instance has its own `Tokenizer`, which is used internally for token counting and management.

### Model Event Hooks

Dexter provides a system of event hooks that allow you to add custom logic at various points in the model execution process. These hooks are defined in the `Model.Events` interface:

1. **Available Hooks**:
   - `onStart`: Called before the model execution starts
   - `onApiResponse`: Called after receiving a response from the API
   - `onComplete`: Called after the model execution is complete
   - `onError`: Called if an error occurs during model execution

2. **Hook Parameters**: Each hook receives an event object with relevant information, such as timestamps, model parameters, responses, and context.

3. **Usage**: Event hooks can be defined when creating a model instance:

   ```typescript
   const chatModel = new ChatModel({
     events: {
       onStart: [(event) => console.log('Starting model execution', event)],
       onComplete: [(event) => console.log('Model execution complete', event)],
     },
   });
   ```

4. **Multiple Handlers**: Each event can have multiple handlers, which are executed in the order they are defined.

5. **Async Handlers**: Event handlers can be asynchronous functions. Dexter uses `Promise.allSettled` to handle multiple async handlers.

6. **Extending Models**: When using the `extend` method to create a new model instance, event handlers are merged, allowing you to add new handlers without removing existing ones.

## License

MIT © [Dexa](https://dexa.ai)
