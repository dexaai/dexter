# Class: `abstract` AbstractDatastore`<DocMeta, Filter>`

## Extended By

- [`AbstractHybridDatastore`](AbstractHybridDatastore.md)

## Type parameters

| Parameter |
| :------ |
| `DocMeta` extends [`BaseMeta`](../namespaces/Dstore/type-aliases/BaseMeta.md) |
| `Filter` extends [`BaseFilter`](../namespaces/Dstore/type-aliases/BaseFilter.md)\<`DocMeta`\> |

## Constructors

### new AbstractDatastore(args)

> **new AbstractDatastore**\<`DocMeta`, `Filter`\>(`args`): [`AbstractDatastore`](AbstractDatastore.md)\<`DocMeta`, `Filter`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | [`Opts`](../namespaces/Dstore/interfaces/Opts.md)\<`DocMeta`, `Filter`\> |

#### Returns

[`AbstractDatastore`](AbstractDatastore.md)\<`DocMeta`, `Filter`\>

#### Source

[src/datastore/datastore.ts:30](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/datastore.ts#L30)

## Properties

| Modifier | Property | Type | Description | Source |
| :------ | :------ | :------ | :------ | :------ |
| `abstract` | `datastoreProvider` | [`Provider`](../namespaces/Dstore/type-aliases/Provider.md) | - | [src/datastore/datastore.ts:21](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/datastore.ts#L21) |
| `abstract` | `datastoreType` | [`Type`](../namespaces/Dstore/type-aliases/Type.md) | - | [src/datastore/datastore.ts:20](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/datastore.ts#L20) |

## Methods

### `abstract` delete()

> **`abstract`** **delete**(`docIds`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `docIds` | `string`[] |

#### Returns

`Promise`\<`void`\>

#### Source

[src/datastore/datastore.ts:17](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/datastore.ts#L17)

***

### `abstract` deleteAll()

> **`abstract`** **deleteAll**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Source

[src/datastore/datastore.ts:18](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/datastore.ts#L18)

***

### query()

> **query**(`query`, `context`?): `Promise`\<[`QueryResult`](../namespaces/Dstore/interfaces/QueryResult.md)\<`DocMeta`\>\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `query` | [`Query`](../namespaces/Dstore/interfaces/Query.md)\<`DocMeta`, `Filter`\> |
| `context`? | [`Ctx`](../namespaces/Dstore/type-aliases/Ctx.md) |

#### Returns

`Promise`\<[`QueryResult`](../namespaces/Dstore/interfaces/QueryResult.md)\<`DocMeta`\>\>

#### Source

[src/datastore/datastore.ts:46](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/datastore.ts#L46)

***

### `abstract` upsert()

> **`abstract`** **upsert**(`docs`, `context`?): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `docs` | [`Doc`](../namespaces/Dstore/interfaces/Doc.md)\<`DocMeta`\>[] |
| `context`? | [`Ctx`](../namespaces/Dstore/type-aliases/Ctx.md) |

#### Returns

`Promise`\<`void`\>

#### Source

[src/datastore/datastore.ts:13](https://github.com/dexaai/llm-tools/blob/2a387dc/src/datastore/datastore.ts#L13)
