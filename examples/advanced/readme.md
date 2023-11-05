# Dexa AI Chatbot Example with RAG from the Huberman Lab Podcast

This is an example using `dexa-ai` to build a basic RAG chatbot. For RAG, it indexes 100 transcript chunks from the [Huberman Lab Podcast](https://hubermanlab.com) into a [hybrid Pinecone datastore](https://docs.pinecone.io/docs/hybrid-search) using [OpenAI ada-002 embeddings](https://platform.openai.com/docs/guides/embeddings) for the dense vectors and a [HuggingFace SPLADE model](https://huggingface.co/naver/splade-cocondenser-ensembledistil) for the sparse embeddings.

## Prequisites

- `OPENAI_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_BASE_URL`
  - Note: as of November 2023, Pinecone's free starter indexes don't support namespaces or hybrid search, so unfortunately you'll need to upgrade to a paid plan to run this example. See Pinecone's [hybrid docs](https://docs.pinecone.io/docs/hybrid-search) for details on setting up a hybrid index, and make sure it is using the `dotproduct` metric.
- `SPLADE_SERVICE_URL`
  - Here is an [example](https://gist.github.com/rileytomasek/c6bba0151d17707a48c7030965b3207f) of how to run a SPLADE REST API, which can be deployed to [Modal](https://modal.com) or any other GPU-enabled hosting provider.

## Usage

```bash
tsx examples/advanced/ingest.ts
```

```bash
tsx examples/advanced/cli.ts
```
