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
| `embedding`? | `number`[] | - | [src/datastore/types.ts:35](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L35) |
| `id` | `string` | - | [src/datastore/types.ts:33](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L33) |
| `metadata` | `Meta` | - | [src/datastore/types.ts:34](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L34) |
| `score`? | `number` | - | [src/datastore/types.ts:37](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L37) |
| `sparseVector`? | [`Vector`](../../Model/namespaces/SparseVector/type-aliases/Vector.md) | - | [src/datastore/types.ts:36](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L36) |
