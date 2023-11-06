<p align="center">
  <a href="https://www.npmjs.com/package/dexter"><img alt="NPM" src="https://img.shields.io/npm/v/dexter.svg" /></a>
  <a href="https://github.com/dexaai/dexter/actions/workflows/test.yml"><img alt="Build Status" src="https://github.com/dexaai/dexter/actions/workflows/main.yml/badge.svg" /></a>
  <a href="https://github.com/dexaai/dexter/blob/main/license"><img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <a href="https://prettier.io"><img alt="Prettier Code Formatting" src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg" /></a>
</p>

# Dexter

> Dexter is a mature set of LLM tools used in production at [Dexa](https://dexa.ai), with a focus on real-world RAG ([Retrieval Augmented Generation](https://arxiv.org/abs/2005.11401)).

## Features

- production-quality RAG
- extremely fast and minimal
- handles caching, throttling, and batching for ingesting large datasets
- optional hybrid search w/ dense + sparse SPLADE embeddings
- supports arbitrary reranking strategies
- minimal TS package w/ full typing
- uses `fetch` everywhere
- supports Node.js 18+, Deno, Cloudflare Workers, Vercel edge functions, etc
