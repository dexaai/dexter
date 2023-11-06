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

[src/datastore/datastore.ts:36](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/datastore.ts#L36)

## Properties

| Modifier | Property | Type | Description | Source |
| :------ | :------ | :------ | :------ | :------ |
| `abstract` | `datastoreProvider` | [`Provider`](../namespaces/Datastore/type-aliases/Provider.md) | - | [src/datastore/datastore.ts:26](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/datastore.ts#L26) |
| `abstract` | `datastoreType` | [`Type`](../namespaces/Datastore/type-aliases/Type.md) | - | [src/datastore/datastore.ts:25](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/datastore.ts#L25) |

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

[src/datastore/datastore.ts:22](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/datastore.ts#L22)

***

### `abstract` deleteAll()

> **`abstract`** **deleteAll**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Source

[src/datastore/datastore.ts:23](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/datastore.ts#L23)

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

[src/datastore/datastore.ts:53](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/datastore.ts#L53)

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

[src/datastore/datastore.ts:18](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/datastore.ts#L18)
