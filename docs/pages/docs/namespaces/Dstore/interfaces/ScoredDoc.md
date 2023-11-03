# Interface: ScoredDoc`<Meta>`

Document with a query score (vector distance/similarity).

## Extends

- [`Doc`](Doc.md)\<`Meta`\>

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `Meta` extends [`BaseMeta`](../type-aliases/BaseMeta.md) | [`BaseMeta`](../type-aliases/BaseMeta.md) |

## Properties

| Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ |
| `embedding`? | `number`[] | - | [`Doc`](Doc.md).`embedding` | [src/datastore/types.ts:35](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L35) |
| `id` | `string` | - | [`Doc`](Doc.md).`id` | [src/datastore/types.ts:33](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L33) |
| `metadata` | `Meta` | - | [`Doc`](Doc.md).`metadata` | [src/datastore/types.ts:34](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L34) |
| `score` | `number` | - | [`Doc`](Doc.md).`score` | [src/datastore/types.ts:149](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L149) |
| `sparseVector`? | [`Vector`](../../Model/namespaces/SparseVector/type-aliases/Vector.md) | - | [`Doc`](Doc.md).`sparseVector` | [src/datastore/types.ts:36](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L36) |
