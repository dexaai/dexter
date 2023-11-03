# Interface: Cache`<DocMeta, Filter>`

Cache for storing query responses

## Type parameters

| Parameter |
| :------ |
| `DocMeta` extends [`BaseMeta`](../type-aliases/BaseMeta.md) |
| `Filter` extends [`BaseFilter`](../type-aliases/BaseFilter.md)\<`DocMeta`\> |

## Methods

### get()

> **get**(`key`): `Promise`\<`null` \| [`QueryResult`](QueryResult.md)\<`DocMeta`\>\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | [`Query`](Query.md)\<`DocMeta`, `Filter`\> |

#### Returns

`Promise`\<`null` \| [`QueryResult`](QueryResult.md)\<`DocMeta`\>\>

#### Source

[src/datastore/types.ts:21](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/types.ts#L21)

***

### set()

> **set**(`key`, `value`): `Promise`\<`boolean`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | [`Query`](Query.md)\<`DocMeta`, `Filter`\> |
| `value` | [`QueryResult`](QueryResult.md)\<`DocMeta`\> |

#### Returns

`Promise`\<`boolean`\>

#### Source

[src/datastore/types.ts:22](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/types.ts#L22)
