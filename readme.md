<p align="center">
  <a href="https://www.npmjs.com/package/dexter"><img alt="NPM" src="https://img.shields.io/npm/v/dexter.svg" /></a>
  <a href="https://github.com/dexaai/dexter/actions/workflows/test.yml"><img alt="Build Status" src="https://github.com/dexaai/dexter/actions/workflows/main.yml/badge.svg" /></a>
  <a href="https://github.com/dexaai/dexter/blob/main/license"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <a href="https://prettier.io"><img alt="Prettier Code Formatting" src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg" /></a>
</p>

- [Dexter](#dexter)
  - [Features](#features)
  - [Install](#install)
  - [Usage](#usage)
  - [Examples](#examples)
    - [Basic](#basic)
    - [Caching](#caching)
    - [Advanced](#advanced)
  - [FAQ](#faq)
    - [Why should I use this package?](#why-should-i-use-this-package)
    - [Don't use Dexter if...](#dont-use-dexter-if)
    - [How does Dexter compare to LangChain?](#how-does-dexter-compare-to-langchain)
    - [How does Dexter compare to LlamaIndex?](#how-does-dexter-compare-to-llamaindex)
  - [License](#license)

# Dexter

> Dexter is a focused set of LLM tools used in production at [Dexa](https://dexa.ai), with a focus on real-world RAG ([Retrieval Augmented Generation](https://arxiv.org/abs/2005.11401)).

## Features

- production-quality RAG
- extremely fast and minimal
- handles caching, throttling, and batching for ingesting large datasets
- optional hybrid search w/ dense + sparse SPLADE embeddings
- supports arbitrary reranking strategies
- minimal TS package w/ full typing
- uses `fetch` everywhere

## Install

```bash
npm install dexter
```

This package requires `node >= 18` or an environment with `fetch` support.

This package only exports [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). If your project uses CommonJS, [consider switching to ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) or use the [dynamic `import()`](https://v8.dev/features/dynamic-import) function.

## Usage

```ts
import 'dotenv/config';
import { EmbeddingModel } from 'dexter/model';
import { PineconeDatastore } from 'dexter/datastore/pinecone';

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

## Examples

To run the included examples, clone this repo, run `pnpm install`, set up your `.env` file, and then run an example file using `tsx`.

Environment variables required to run the examples:

- `OPENAI_API_KEY` - OpenAI API key
- `PINECONE_API_KEY` - Pinecone API key
- `PINECONE_BASE_URL` - Pinecone index's base URL
  - You should be able to use a free-tier "starter" index for most of the examples, but you'll need to upgrade to a paid index to run the advanced example which uses hybrid search.
  - Note that Pinecone's free starter index doesn't support namespaces, `deleteAll`, or hybrid search :sigh:
- `SPLADE_SERVICE_URL` - optional; only used for the advanced hybrid search example

#### Basic

```bash
npx tsx examples/basic.ts
```

#### Caching

```bash
npx tsx examples/caching.ts
```

#### Advanced

This is a more involved example of a chatbot using RAG. It indexes 100 transcript chunks from the [Huberman Lab Podcast](https://hubermanlab.com) into a [hybrid Pinecone datastore](https://docs.pinecone.io/docs/hybrid-search) using [OpenAI ada-002 embeddings](https://platform.openai.com/docs/guides/embeddings) for the dense vectors and a [HuggingFace SPLADE model](https://huggingface.co/naver/splade-cocondenser-ensembledistil) for the sparse embeddings.

See the [advanced example readme](./examples/advanced/readme.md) for more details.

```bash
npx tsx examples/advanced/ingest.ts
```

```bash
npx tsx examples/advanced/cli.ts
```

## FAQ

### Why should I use this package?

- Dozens of the world's top podcasters trust Dexa's RAG to represent them
- Optimized for real production-quality RAG
- We've spent thousands of hours testing this package in production
- We only use best-in-class third-parties like [OpenAI](https://openai.com) and [Pinecone](https://www.pinecone.io)
- Simple and extremely minimal TS package (no complicated abstractions)
- Supports all envs with native fetch: Node.js 18+, Deno, Cloudflare Workers, etc
  - Uses [openai-fetch](https://github.com/dexaai/openai-fetch) and [pinecone-client](https://github.com/dexaai/pinecone-client) under the hood

### Don't use Dexter if...

- You need to use an embedding model other than OpenAI's
  - Popular alternatives include [Sentence Transformers](https://www.sbert.net) and [Cohere Embed v3](https://txt.cohere.com/introducing-embed-v3/)
  - _We'll be adding support for more embedding model providers soon_, but we will never sacrifice DX for breadth
- You need to use a vector DB other than Pinecone
  - _We'll be adding support for more vector DBs soon_, but we will never sacrifice DX for breadth
- You need to use a programming language other than JS/TS
  - _What even is Python?_ 😂

### How does Dexter compare to LangChain?

- Dexter is much more minimal
- Dexter is focused solely on RAG
- Dexter only supports TypeScript

- LangChain is more powerful but also a lot more complicated
- Langchain is Python-first
- LangChain supports hundreds of LLM, embedding, and vector DB providers

### How does Dexter compare to LlamaIndex?

Dexter and LlamaIndex are both focused on RAG. LlamaIndex supports many more loaders, embedding providers, and vector DBs.

## License

MIT © [Dexa](https://dexa.ai)
