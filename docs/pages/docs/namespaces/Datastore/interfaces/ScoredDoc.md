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
| `embedding`? | `number`[] | - | [`Doc`](Doc.md).`embedding` | [src/datastore/types.ts:22](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/datastore/types.ts#L22) |
| `id` | `string` | - | [`Doc`](Doc.md).`id` | [src/datastore/types.ts:20](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/datastore/types.ts#L20) |
| `metadata` | `Meta` | - | [`Doc`](Doc.md).`metadata` | [src/datastore/types.ts:21](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/datastore/types.ts#L21) |
| `score` | `number` | - | [`Doc`](Doc.md).`score` | [src/datastore/types.ts:151](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/datastore/types.ts#L151) |
| `sparseVector`? | [`Vector`](../../Model/namespaces/SparseVector/type-aliases/Vector.md) | - | [`Doc`](Doc.md).`sparseVector` | [src/datastore/types.ts:23](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/datastore/types.ts#L23) |
