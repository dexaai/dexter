<p align="center">
  <a href="https://www.npmjs.com/package/dexa-ai"><img alt="NPM" src="https://img.shields.io/npm/v/dexa-ai.svg" /></a>
  <a href="https://github.com/dexaai/dexa-ai/actions/workflows/test.yml"><img alt="Build Status" src="https://github.com/dexaai/dexa-ai/actions/workflows/main.yml/badge.svg" /></a>
  <a href="https://github.com/dexaai/dexa-ai/blob/main/license"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <a href="https://prettier.io"><img alt="Prettier Code Formatting" src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg" /></a>
</p>

# Dexa AI

LLM tools used in production at Dexa with a focus on RAG ([Retrieval Augmented Generation](https://arxiv.org/abs/2005.11401)).

## Install

```bash
npm install dexa-ai
```

This package requires `node >= 18` or an environment with `fetch` support.

This package exports [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)-only. If your project uses CommonJS, [consider switching to ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) or use the [dynamic `import()`](https://v8.dev/features/dynamic-import) function.

## Usage

```ts
import 'dotenv/config';
import { EmbeddingModel, PineconeDatastore } from 'dexa-ai';

function example() {
  const embeddingModel = new EmbeddingModel({
    params: {
      model: 'text-embedding-ada-002',
    },
  });

  const store = new PineconeDatastore({
    namespace: 'test',
    contentKey: 'content',
    embeddingModel,
    hooks: { onQueryComplete: [console.log] },
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

  const result = await store.query({
    query: 'dolphin',
  });
  console.log(JSON.stringify(result, null, 2));
}
```

## FAQ

### Why should I use this package?

- Hundreds of top 1% creators rely on Dexa's production RAG to generate content for their audience
- We only use best-in-class third-parties like [OpenAI](https://openai.com) and [Pinecone](https://www.pinecone.io)
- Simple and extremely minimal TS
- Supports all envs with native fetch: Node.js 18+, Deno, Cloudflare Workers, etc

### Don't use Dexa AI if...

- You want to use an embedding model other than OpenAI's
  - Popular alternatives include [Sentence Transformers](https://www.sbert.net) and [Cohere Embed v3](https://txt.cohere.com/introducing-embed-v3/)
  - _We'll be adding support for more embedding model providers soon_
- You want to use a vector DB other than Pinecone
  - _We'll be adding support for more vector DBs soon_
- You want to use a programming language other than JS/TS
  - _What even is Python?_ 😂

## License

MIT © [Dexa](https://dexa.ai)
