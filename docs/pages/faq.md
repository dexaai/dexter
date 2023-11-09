# FAQ

### Why should I consider using Dexter?

- **Dozens of the world's top podcasters trust Dexa's RAG to represent them**
- Optimized for production-quality RAG
- We only use best-in-class third-parties like [OpenAI](https://openai.com) and [Pinecone](https://www.pinecone.io)
- Simple and extremely minimal TS package (no complicated abstractions)
- Supports all envs with native fetch: Node.js 18+, Deno, Cloudflare Workers, etc
  - Uses [openai-fetch](https://github.com/dexaai/openai-fetch) and [pinecone-client](https://github.com/dexaai/pinecone-client) under the hood

### Don't use Dexter if...

- **You need to use an embedding model other than OpenAI's**
  - Popular alternatives include [Sentence Transformers](https://www.sbert.net) and [Cohere Embed v3](https://txt.cohere.com/introducing-embed-v3/)
  - _We'll be adding support for more embedding model providers soon_, but we will never sacrifice DX for breadth
- **You need to use a vector DB other than Pinecone**
  - _We'll be adding support for more vector DBs soon_, but we will never sacrifice DX for breadth
- **You need to use a programming language other than JS/TS**
  - _What even is Python?_ 😂

### How does Dexter compare to LangChain?

- Dexter is much more **minimal**
- Dexter is focused solely on RAG
- Dexter only supports TypeScript

- LangChain is more powerful but also a lot more complicated
- Langchain is Python-first
- LangChain supports hundreds of LLM, embedding, and vector DB providers

### How does Dexter compare to LlamaIndex?

Dexter and LlamaIndex are both focused on RAG. LlamaIndex supports many more loaders, embedding providers, and vector DBs, and has a lot more recipes built into it out-of-the-box.

If you want a TypeScript-first RAG solution that's extremely minimal but battle-tested in production, use Dexter. If you want a Python-first RAG solution that's more powerful and has more features, use LlamaIndex.

You can also use both! Use LlamaIndex to load/transform/chunk your data and then use Dexter to index and query it. Huzzzh OSS! 🎉

### Does Dexter support loading PDF/HTML/Notion/markdown/etc?

Yes, but we do not provide loaders for each of these out of the box, as Dexter is meant to do one thing and do it well.

For loaders and chunking, we recommend that you use one of the following solutions:

- [LangChain Loaders](https://js.langchain.com/docs/modules/data_connection/document_loaders/)
- [LlamaIndex](https://www.llamaindex.ai) via [LlamaHub](https://llamahub.ai)
- [Unstructured](https://unstructured.io)
- Roll your own –– YOLO!
