# Class: `abstract` AbstractHybridDatastore`<DocMeta, Filter>`

## Extends

- [`AbstractDatastore`](AbstractDatastore.md)\<`DocMeta`, `Filter`\>

## Type parameters

| Parameter |
| :------ |
| `DocMeta` extends [`BaseMeta`](../namespaces/Dstore/type-aliases/BaseMeta.md) |
| `Filter` extends [`BaseFilter`](../namespaces/Dstore/type-aliases/BaseFilter.md)\<`DocMeta`\> |

## Constructors

### new AbstractHybridDatastore(args)

> **new AbstractHybridDatastore**\<`DocMeta`, `Filter`\>(`args`): [`AbstractHybridDatastore`](AbstractHybridDatastore.md)\<`DocMeta`, `Filter`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | [`OptsHybrid`](../namespaces/Dstore/interfaces/OptsHybrid.md)\<`DocMeta`, `Filter`\> |

#### Returns

[`AbstractHybridDatastore`](AbstractHybridDatastore.md)\<`DocMeta`, `Filter`\>

#### Overrides

[`AbstractDatastore`](AbstractDatastore.md).[`constructor`](AbstractDatastore.md#Constructors)

#### Source

[src/datastore/hybrid-datastore.ts:11](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/hybrid-datastore.ts#L11)

## Properties

| Modifier | Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ | :------ |
| `abstract` | `datastoreProvider` | [`Provider`](../namespaces/Dstore/type-aliases/Provider.md) | - | [`AbstractDatastore`](AbstractDatastore.md).`datastoreProvider` | [src/datastore/datastore.ts:21](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/datastore.ts#L21) |
| `abstract` | `datastoreType` | [`Type`](../namespaces/Dstore/type-aliases/Type.md) | - | [`AbstractDatastore`](AbstractDatastore.md).`datastoreType` | [src/datastore/datastore.ts:20](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/datastore.ts#L20) |

## Methods

### `abstract` delete()

> **`abstract`** **delete**(`docIds`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `docIds` | `string`[] |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`AbstractDatastore`](AbstractDatastore.md).[`delete`](AbstractDatastore.md#abstract-delete)

#### Source

[src/datastore/datastore.ts:17](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/datastore.ts#L17)

***

### `abstract` deleteAll()

> **`abstract`** **deleteAll**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`AbstractDatastore`](AbstractDatastore.md).[`deleteAll`](AbstractDatastore.md#abstract-deleteAll)

#### Source

[src/datastore/datastore.ts:18](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/datastore.ts#L18)

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

#### Inherited from

[`AbstractDatastore`](AbstractDatastore.md).[`query`](AbstractDatastore.md#query)

#### Source

[src/datastore/datastore.ts:46](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/datastore.ts#L46)

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

#### Inherited from

[`AbstractDatastore`](AbstractDatastore.md).[`upsert`](AbstractDatastore.md#abstract-upsert)

#### Source

[src/datastore/datastore.ts:13](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/datastore.ts#L13)
