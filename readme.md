<p>
  <a href="https://www.npmjs.com/package/@dexaai/dexter"><img alt="NPM" src="https://img.shields.io/npm/v/@dexaai/dexter.svg" /></a>
  <a href="https://github.com/dexaai/dexter/actions/workflows/test.yml"><img alt="Build Status" src="https://github.com/dexaai/dexter/actions/workflows/main.yml/badge.svg" /></a>
  <a href="https://github.com/dexaai/dexter/blob/main/license"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <a href="https://prettier.io"><img alt="Prettier Code Formatting" src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg" /></a>
</p>

# Dexter <!-- omit from toc -->

Dexter is a set of mature LLM tools used in production at [Dexa](https://dexa.ai), with a focus on real-world RAG ([Retrieval Augmented Generation](https://arxiv.org/abs/2005.11401)).

_If you're a TypeScript AI engineer, check it out!_ 😊

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [Docs](#docs)
- [Examples](#examples)
  - [Basic](#basic)
  - [Caching](#caching)
  - [Redis Caching](#redis-caching)
  - [AI Function](#ai-function)
  - [AI Runner](#ai-runner)
  - [Chatbot](#chatbot)
- [License](#license)

## Features

- production-quality RAG
- extremely fast and minimal
- handles caching, throttling, and batching for ingesting large datasets
- optional hybrid search w/ SPLADE embeddings
- minimal TS package w/ full typing
- uses `fetch` everywhere
- supports Node.js 18+, Deno, Cloudflare Workers, Vercel edge functions, etc
- [full docs](https://dexter.dexa.ai)

## Install

```bash
npm install @dexaai/dexter
```

This package requires `node >= 18` or an environment with `fetch` support.

This package exports [ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If your project uses CommonJS, consider switching to ESM or use the [dynamic `import()`](https://v8.dev/features/dynamic-import) function.

## Usage

This is a basic example using OpenAI's [text-embedding-ada-002](https://platform.openai.com/docs/guides/embeddings) embedding model and a [Pinecone](https://www.pinecone.io/) datastore to index and query a set of documents.

```ts
import 'dotenv/config';
import { EmbeddingModel } from '@dexaai/dexter/model';
import { PineconeDatastore } from '@dexaai/dexter/datastore/pinecone';

async function example() {
  const embeddingModel = new EmbeddingModel({
    params: { model: 'text-embedding-ada-002' },
  });

  const store = new PineconeDatastore({
    contentKey: 'content',
    embeddingModel,
  });

  await store.upsert([
    { id: '1', metadata: { content: 'cat' } },
    { id: '2', metadata: { content: 'dog' } },
    { id: '3', metadata: { content: 'whale' } },
    { id: '4', metadata: { content: 'shark' } },
    { id: '5', metadata: { content: 'computer' } },
    { id: '6', metadata: { content: 'laptop' } },
    { id: '7', metadata: { content: 'phone' } },
    { id: '8', metadata: { content: 'tablet' } },
  ]);

  const result = await store.query({ query: 'dolphin' });
  console.log(result);
}
```

## Docs

See the [docs](https://dexter.dexa.ai) for a full usage guide and API reference.

## Examples

To run the included examples, clone this repo, run `pnpm install`, set up your `.env` file, and then run an example file using `tsx`.

Environment variables required to run the examples:

- `OPENAI_API_KEY` - OpenAI API key
- `PINECONE_API_KEY` - Pinecone API key
- `PINECONE_BASE_URL` - Pinecone index's base URL
  - You should be able to use a free-tier "starter" index for most of the examples, but you'll need to upgrade to a paid index to run the any of the hybrid search examples
  - Note that Pinecone's free starter index doesn't support namespaces, `deleteAll`, or hybrid search _:sigh:_
- `SPLADE_SERVICE_URL` - optional; only used for the chatbot hybrid search example

### Basic

```bash
npx tsx examples/basic.ts
```

[source](./examples/basic.ts)

### Caching

```bash
npx tsx examples/caching.ts
```

[source](./examples/caching.ts)

### Redis Caching

This example requires a valid `REDIS_URL` env var.

```bash
npx tsx examples/caching-redis.ts
```

[source](./examples/caching-redis.ts)

### AI Function

This example shows how to use `createAIFunction` to handle `function` and `tool_calls` with the OpenAI chat completions API and Zod.

```bash
npx tsx examples/ai-function.ts
```

[source](./examples/ai-function.ts)

### AI Runner

This example shows how to use `createAIRunner` to easily invoke a chain of OpenAI chat completion calls, resolving tool / function calls, retrying when necessary, and optionally validating the resulting output via Zod.

Note that `createAIRunner` takes in a `functions` array of `AIFunction` objects created by `createAIFunction`, as the two utility functions are meant to used together.

```bash
npx tsx examples/ai-runner.ts
```

[source](./examples/ai-runner.ts)

### Chatbot

This is a more involved example of a chatbot using RAG. It indexes 100 transcript chunks from the [Huberman Lab Podcast](https://hubermanlab.com) into a [hybrid Pinecone datastore](https://docs.pinecone.io/docs/hybrid-search) using [OpenAI ada-002 embeddings](https://platform.openai.com/docs/guides/embeddings) for the dense vectors and a [HuggingFace SPLADE model](https://huggingface.co/naver/splade-cocondenser-ensembledistil) for the sparse embeddings.

You'll need the following environment variables to run this example:

- `OPENAI_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_BASE_URL`
  - Note: Pinecone's free starter indexes don't seem to support namespaces or hybrid search, so unfortunately you'll need to upgrade to a paid plan to run this example. See Pinecone's [hybrid docs](https://docs.pinecone.io/docs/hybrid-search) for details on setting up a hybrid index, and make sure it is using the `dotproduct` metric.
- `SPLADE_SERVICE_URL`
  - Here is an [example](https://gist.github.com/transitive-bullshit/cc9140ff832fc7e815a48f0a45e1fc27) of how to run a SPLADE REST API, which can be deployed to [Modal](https://modal.com) or any other GPU-enabled hosting provider.

```bash
npx tsx examples/chatbot/ingest.ts
```

```bash
npx tsx examples/chatbot/cli.ts
```

[source](./examples/chatbot)

## License

MIT © [Dexa](https://dexa.ai)
