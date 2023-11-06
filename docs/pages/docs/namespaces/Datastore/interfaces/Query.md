# Interface: Query`<Meta, Filter>`

Arguments to run a query.

## Type parameters

| Parameter |
| :------ |
| `Meta` extends [`BaseMeta`](../type-aliases/BaseMeta.md) |
| `Filter` extends [`BaseFilter`](../type-aliases/BaseFilter.md)\<`Meta`\> |

## Properties

| Property | Type | Description | Source |
| :------ | :------ | :------ | :------ |
| `embedding`? | `number`[] | - | [src/datastore/types.ts:124](https://github.com/dexaai/llm-tools/blob/1257af6/src/datastore/types.ts#L124) |
| `filter`? | `Filter` | - | [src/datastore/types.ts:128](https://github.com/dexaai/llm-tools/blob/1257af6/src/datastore/types.ts#L128) |
| `hybridAlpha`? | `number` | - | [src/datastore/types.ts:130](https://github.com/dexaai/llm-tools/blob/1257af6/src/datastore/types.ts#L130) |
| `includeValues`? | `boolean` | - | [src/datastore/types.ts:129](https://github.com/dexaai/llm-tools/blob/1257af6/src/datastore/types.ts#L129) |
| `minScore`? | `number` | - | [src/datastore/types.ts:127](https://github.com/dexaai/llm-tools/blob/1257af6/src/datastore/types.ts#L127) |
| `query` | `string` | - | [src/datastore/types.ts:123](https://github.com/dexaai/llm-tools/blob/1257af6/src/datastore/types.ts#L123) |
| `sparseVector`? | [`Vector`](../../Model/namespaces/SparseVector/type-aliases/Vector.md) | - | [src/datastore/types.ts:125](https://github.com/dexaai/llm-tools/blob/1257af6/src/datastore/types.ts#L125) |
| `topK`? | `number` | - | [src/datastore/types.ts:126](https://github.com/dexaai/llm-tools/blob/1257af6/src/datastore/types.ts#L126) |
