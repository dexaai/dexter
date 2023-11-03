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
| `cache`? | [`Cache`](Cache.md)\<`DocMeta`, `Filter`\> | - | [`Opts`](Opts.md).`cache` | [src/datastore/types.ts:95](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/types.ts#L95) |
| `contentKey` | keyof `DocMeta` | The metadata key of the content that is embedded.<br />The value associated with the key must be a string. | [`Opts`](Opts.md).`contentKey` | [src/datastore/types.ts:92](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/types.ts#L92) |
| `context`? | [`Ctx`](../type-aliases/Ctx.md) | - | [`Opts`](Opts.md).`context` | [src/datastore/types.ts:97](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/types.ts#L97) |
| `debug`? | `boolean` | - | [`Opts`](Opts.md).`debug` | [src/datastore/types.ts:98](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/types.ts#L98) |
| `embeddingModel` | [`EmbeddingModel`](../../../classes/EmbeddingModel.md) | - | [`Opts`](Opts.md).`embeddingModel` | [src/datastore/types.ts:94](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/types.ts#L94) |
| `events`? | [`Events`](Events.md)\<`DocMeta`, `Filter`\> | - | [`Opts`](Opts.md).`events` | [src/datastore/types.ts:96](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/types.ts#L96) |
| `namespace` | `string` | - | [`Opts`](Opts.md).`namespace` | [src/datastore/types.ts:93](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/types.ts#L93) |
| `spladeModel` | [`SparseVectorModel`](../../../classes/SparseVectorModel.md) | Splade instance for creating sparse vectors | - | [src/datastore/types.ts:109](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/types.ts#L109) |
