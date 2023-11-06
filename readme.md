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
- [License](#license)

## Features

- production-quality RAG
- extremely fast and minimal
- handles caching, throttling, and batching for ingesting large datasets
- optional hybrid search w/ dense + sparse SPLADE embeddings
- supports arbitrary reranking strategies
- minimal TS package w/ full typing
- uses `fetch` everywhere
- supports Node.js 18+, Deno, Cloudflare Workers, Vercel edge functions, etc
- [well-documented](https://dexter.dexa.ai)

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

## License

MIT © [Dexa](https://dexa.ai)
