# Class: `abstract` AbstractHybridDatastore`<DocMeta, Filter>`

## Extends

- [`AbstractDatastore`](AbstractDatastore.md)\<`DocMeta`, `Filter`\>

## Type parameters

| Parameter |
| :------ |
| `DocMeta` extends [`BaseMeta`](../namespaces/Datastore/type-aliases/BaseMeta.md) |
| `Filter` extends [`BaseFilter`](../namespaces/Datastore/type-aliases/BaseFilter.md)\<`DocMeta`\> |

## Constructors

### new AbstractHybridDatastore(args)

> **new AbstractHybridDatastore**\<`DocMeta`, `Filter`\>(`args`): [`AbstractHybridDatastore`](AbstractHybridDatastore.md)\<`DocMeta`, `Filter`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | [`OptsHybrid`](../namespaces/Datastore/interfaces/OptsHybrid.md)\<`DocMeta`, `Filter`\> |

#### Returns

[`AbstractHybridDatastore`](AbstractHybridDatastore.md)\<`DocMeta`, `Filter`\>

#### Overrides

[`AbstractDatastore`](AbstractDatastore.md).[`constructor`](AbstractDatastore.md#Constructors)

#### Source

[src/datastore/hybrid-datastore.ts:11](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/hybrid-datastore.ts#L11)

## Properties

| Modifier | Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ | :------ |
| `abstract` | `datastoreProvider` | [`Provider`](../namespaces/Datastore/type-aliases/Provider.md) | - | [`AbstractDatastore`](AbstractDatastore.md).`datastoreProvider` | [src/datastore/datastore.ts:26](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/datastore.ts#L26) |
| `abstract` | `datastoreType` | [`Type`](../namespaces/Datastore/type-aliases/Type.md) | - | [`AbstractDatastore`](AbstractDatastore.md).`datastoreType` | [src/datastore/datastore.ts:25](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/datastore.ts#L25) |

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

[src/datastore/datastore.ts:22](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/datastore.ts#L22)

***

### `abstract` deleteAll()

> **`abstract`** **deleteAll**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`AbstractDatastore`](AbstractDatastore.md).[`deleteAll`](AbstractDatastore.md#abstract-deleteAll)

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

#### Inherited from

[`AbstractDatastore`](AbstractDatastore.md).[`query`](AbstractDatastore.md#query)

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

#### Inherited from

[`AbstractDatastore`](AbstractDatastore.md).[`upsert`](AbstractDatastore.md#abstract-upsert)

#### Source

[src/datastore/datastore.ts:18](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/datastore.ts#L18)
