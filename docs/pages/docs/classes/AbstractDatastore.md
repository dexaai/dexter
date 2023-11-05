# Class: `abstract` AbstractDatastore`<DocMeta, Filter>`

## Extended By

- [`AbstractHybridDatastore`](AbstractHybridDatastore.md)

## Type parameters

| Parameter |
| :------ |
| `DocMeta` extends [`BaseMeta`](../namespaces/Datastore/type-aliases/BaseMeta.md) |
| `Filter` extends [`BaseFilter`](../namespaces/Datastore/type-aliases/BaseFilter.md)\<`DocMeta`\> |

## Constructors

### new AbstractDatastore(args)

> **new AbstractDatastore**\<`DocMeta`, `Filter`\>(`args`): [`AbstractDatastore`](AbstractDatastore.md)\<`DocMeta`, `Filter`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | [`Opts`](../namespaces/Datastore/interfaces/Opts.md)\<`DocMeta`, `Filter`\> |

#### Returns

[`AbstractDatastore`](AbstractDatastore.md)\<`DocMeta`, `Filter`\>

#### Source

[src/datastore/datastore.ts:30](https://github.com/dexaai/llm-tools/blob/eeaf162/src/datastore/datastore.ts#L30)

## Properties

| Modifier | Property | Type | Description | Source |
| :------ | :------ | :------ | :------ | :------ |
| `abstract` | `datastoreProvider` | [`Provider`](../namespaces/Datastore/type-aliases/Provider.md) | - | [src/datastore/datastore.ts:21](https://github.com/dexaai/llm-tools/blob/eeaf162/src/datastore/datastore.ts#L21) |
| `abstract` | `datastoreType` | [`Type`](../namespaces/Datastore/type-aliases/Type.md) | - | [src/datastore/datastore.ts:20](https://github.com/dexaai/llm-tools/blob/eeaf162/src/datastore/datastore.ts#L20) |

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

[src/datastore/datastore.ts:17](https://github.com/dexaai/llm-tools/blob/eeaf162/src/datastore/datastore.ts#L17)

***

### `abstract` deleteAll()

> **`abstract`** **deleteAll**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Source

[src/datastore/datastore.ts:18](https://github.com/dexaai/llm-tools/blob/eeaf162/src/datastore/datastore.ts#L18)

***

### query()

> **query**(`query`, `context`?): `Promise`\<[`QueryResult`](../namespaces/Datastore/interfaces/QueryResult.md)\<`DocMeta`\>\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `query` | [`Query`](../namespaces/Datastore/interfaces/Query.md)\<`DocMeta`, `Filter`\> |
| `context`? | [`Ctx`](../namespaces/Datastore/type-aliases/Ctx.md) |

#### Returns

`Promise`\<[`QueryResult`](../namespaces/Datastore/interfaces/QueryResult.md)\<`DocMeta`\>\>

#### Source

[src/datastore/datastore.ts:46](https://github.com/dexaai/llm-tools/blob/eeaf162/src/datastore/datastore.ts#L46)

***

### `abstract` upsert()

> **`abstract`** **upsert**(`docs`, `context`?): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `docs` | [`Doc`](../namespaces/Datastore/interfaces/Doc.md)\<`DocMeta`\>[] |
| `context`? | [`Ctx`](../namespaces/Datastore/type-aliases/Ctx.md) |

#### Returns

`Promise`\<`void`\>

#### Source

[src/datastore/datastore.ts:13](https://github.com/dexaai/llm-tools/blob/eeaf162/src/datastore/datastore.ts#L13)
