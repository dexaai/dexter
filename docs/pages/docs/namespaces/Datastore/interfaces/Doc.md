# Interface: Doc`<Meta>`

A Doc is the unit of storage for data in a Datastore

## Extended By

- [`ScoredDoc`](ScoredDoc.md)

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `Meta` extends [`BaseMeta`](../type-aliases/BaseMeta.md) | [`BaseMeta`](../type-aliases/BaseMeta.md) |

## Properties

| Property | Type | Description | Source |
| :------ | :------ | :------ | :------ |
| `embedding`? | `number`[] | - | [src/datastore/types.ts:22](https://github.com/dexaai/llm-tools/blob/3551610/src/datastore/types.ts#L22) |
| `id` | `string` | - | [src/datastore/types.ts:20](https://github.com/dexaai/llm-tools/blob/3551610/src/datastore/types.ts#L20) |
| `metadata` | `Meta` | - | [src/datastore/types.ts:21](https://github.com/dexaai/llm-tools/blob/3551610/src/datastore/types.ts#L21) |
| `score`? | `number` | - | [src/datastore/types.ts:24](https://github.com/dexaai/llm-tools/blob/3551610/src/datastore/types.ts#L24) |
| `sparseVector`? | [`Vector`](../../Model/namespaces/SparseVector/type-aliases/Vector.md) | - | [src/datastore/types.ts:23](https://github.com/dexaai/llm-tools/blob/3551610/src/datastore/types.ts#L23) |
