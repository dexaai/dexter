# Interface: OptsHybrid`<DocMeta, Filter>`

Options for creating a hybrid Datastore instance (with Splade).

## Extends

- [`Opts`](Opts.md)\<`DocMeta`, `Filter`\>

## Type parameters

| Parameter |
| :------ |
| `DocMeta` extends [`BaseMeta`](../type-aliases/BaseMeta.md) |
| `Filter` extends [`BaseFilter`](../type-aliases/BaseFilter.md)\<`DocMeta`\> |

## Properties

| Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ |
| `cache`? | [`CacheStorage`](../../../type-aliases/CacheStorage.md)\<`string`, [`QueryResult`](QueryResult.md)\<`DocMeta`\>\> | Enables caching for queries. Must implement `.get(key)` and `.set(key, value)`, both of which can be either sync or async.<br /><br />Some examples include: `new Map()`, [quick-lru](https://github.com/sindresorhus/quick-lru), or any [keyv adaptor](https://github.com/jaredwray/keyv). | [`Opts`](Opts.md).`cache` | [src/datastore/types.ts:95](https://github.com/dexaai/llm-tools/blob/98f7fd5/src/datastore/types.ts#L95) |
| `cacheKey`? | [`CacheKey`](../../../type-aliases/CacheKey.md)\<[`Query`](Query.md)\<`DocMeta`, `Filter`\>, `string`\> | A function that returns a cache key for the given params.<br /><br />A simple example would be: `(params) => JSON.stringify(params)`<br /><br />The default `cacheKey` function uses [hash-obj](https://github.com/sindresorhus/hash-obj) to create a stable sha256 hash of the params. | [`Opts`](Opts.md).`cacheKey` | [src/datastore/types.ts:89](https://github.com/dexaai/llm-tools/blob/98f7fd5/src/datastore/types.ts#L89) |
| `contentKey` | keyof `DocMeta` | The metadata key of the content that is embedded.<br />The value associated with the key must be a string. | [`Opts`](Opts.md).`contentKey` | [src/datastore/types.ts:79](https://github.com/dexaai/llm-tools/blob/98f7fd5/src/datastore/types.ts#L79) |
| `context`? | [`Ctx`](../type-aliases/Ctx.md) | - | [`Opts`](Opts.md).`context` | [src/datastore/types.ts:97](https://github.com/dexaai/llm-tools/blob/98f7fd5/src/datastore/types.ts#L97) |
| `debug`? | `boolean` | Whether or not to add default `console.log` event handlers | [`Opts`](Opts.md).`debug` | [src/datastore/types.ts:99](https://github.com/dexaai/llm-tools/blob/98f7fd5/src/datastore/types.ts#L99) |
| `embeddingModel` | [`EmbeddingModel`](../../../classes/EmbeddingModel.md) | - | [`Opts`](Opts.md).`embeddingModel` | [src/datastore/types.ts:81](https://github.com/dexaai/llm-tools/blob/98f7fd5/src/datastore/types.ts#L81) |
| `events`? | [`Events`](Events.md)\<`DocMeta`, `Filter`\> | - | [`Opts`](Opts.md).`events` | [src/datastore/types.ts:96](https://github.com/dexaai/llm-tools/blob/98f7fd5/src/datastore/types.ts#L96) |
| `namespace`? | `string` | - | [`Opts`](Opts.md).`namespace` | [src/datastore/types.ts:80](https://github.com/dexaai/llm-tools/blob/98f7fd5/src/datastore/types.ts#L80) |
| `spladeModel` | [`SparseVectorModel`](../../../classes/SparseVectorModel.md) | Splade instance for creating sparse vectors | - | [src/datastore/types.ts:110](https://github.com/dexaai/llm-tools/blob/98f7fd5/src/datastore/types.ts#L110) |
