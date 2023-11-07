# Interface: QueryResult`<Meta>`

The results of running a query.

## Type parameters

| Parameter |
| :------ |
| `Meta` extends [`BaseMeta`](../type-aliases/BaseMeta.md) |

## Properties

| Property | Type | Description | Source |
| :------ | :------ | :------ | :------ |
| `cached`? | `boolean` | - | [src/datastore/types.ts:143](https://github.com/dexaai/llm-tools/blob/98f7fd5/src/datastore/types.ts#L143) |
| `docs` | [`ScoredDoc`](ScoredDoc.md)\<`Meta`\>[] | - | [src/datastore/types.ts:142](https://github.com/dexaai/llm-tools/blob/98f7fd5/src/datastore/types.ts#L142) |
| `query` | `string` | - | [src/datastore/types.ts:141](https://github.com/dexaai/llm-tools/blob/98f7fd5/src/datastore/types.ts#L141) |
