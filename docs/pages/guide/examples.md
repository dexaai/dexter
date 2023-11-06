# Examples

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

[source](https://github.com/dexaai/dexter/tree/master/examples/basic.ts)

### Caching

```bash
npx tsx examples/caching.ts
```

[source](https://github.com/dexaai/dexter/tree/master/examples/caching.ts)

### Redis Caching

This example requires a valid `REDIS_URL` env var.

```bash
npx tsx examples/caching-redis.ts
```

[source](https://github.com/dexaai/dexter/tree/master/examples/caching-redis.ts)

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

[source](https://github.com/dexaai/dexter/tree/master/examples/chatbot)
