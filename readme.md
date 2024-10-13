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
- [Examples](#examples)
  - [Caching](#caching)
  - [Redis Caching](#redis-caching)
  - [AI Function](#ai-function)
  - [AI Runner](#ai-runner)
- [License](#license)

## Features

- extremely fast and minimal
- handles caching, throttling, and batching for ingesting large datasets
- optional hybrid search w/ SPLADE embeddings
- minimal TS package w/ full typing
- uses `fetch` everywhere
- supports Node.js 18+, Deno, Cloudflare Workers, Vercel edge functions, etc

## Install

```bash
npm install @dexaai/dexter
```

This package requires `node >= 18` or an environment with `fetch` support.

This package exports [ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If your project uses CommonJS, consider switching to ESM or use the [dynamic `import()`](https://v8.dev/features/dynamic-import) function.

## Examples

To run the included examples, clone this repo, run `pnpm install`, set up your `.env` file, and then run an example file using `tsx`.

Environment variables required to run the examples:

- `OPENAI_API_KEY` - OpenAI API key
- `SPLADE_SERVICE_URL` - optional; only used for the chatbot hybrid search example

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

## License

MIT © [Dexa](https://dexa.ai)
