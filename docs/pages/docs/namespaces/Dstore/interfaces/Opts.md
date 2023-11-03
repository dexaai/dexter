# Interface: Opts`<DocMeta, Filter>`

Options for creating a Datastore instance.

## Extended By

- [`OptsHybrid`](OptsHybrid.md)

## Type parameters

| Parameter |
| :------ |
| `DocMeta` extends [`BaseMeta`](../type-aliases/BaseMeta.md) |
| `Filter` extends [`BaseFilter`](../type-aliases/BaseFilter.md)\<`DocMeta`\> |

## Properties

| Property | Type | Description | Source |
| :------ | :------ | :------ | :------ |
| `cache`? | [`Cache`](Cache.md)\<`DocMeta`, `Filter`\> | - | [src/datastore/types.ts:95](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L95) |
| `contentKey` | keyof `DocMeta` | The metadata key of the content that is embedded.<br />The value associated with the key must be a string. | [src/datastore/types.ts:92](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L92) |
| `context`? | [`Ctx`](../type-aliases/Ctx.md) | - | [src/datastore/types.ts:97](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L97) |
| `debug`? | `boolean` | - | [src/datastore/types.ts:98](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L98) |
| `embeddingModel` | [`EmbeddingModel`](../../../classes/EmbeddingModel.md) | - | [src/datastore/types.ts:94](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L94) |
| `events`? | [`Events`](Events.md)\<`DocMeta`, `Filter`\> | - | [src/datastore/types.ts:96](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L96) |
| `namespace` | `string` | - | [src/datastore/types.ts:93](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L93) |
