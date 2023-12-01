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

[src/datastore/hybrid-datastore.ts:11](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/hybrid-datastore.ts#L11)

## Properties

| Modifier | Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ | :------ |
| `abstract` | `datastoreProvider` | [`Provider`](../namespaces/Datastore/type-aliases/Provider.md) | - | [`AbstractDatastore`](AbstractDatastore.md).`datastoreProvider` | [src/datastore/datastore.ts:26](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/datastore.ts#L26) |
| `abstract` | `datastoreType` | [`Type`](../namespaces/Datastore/type-aliases/Type.md) | - | [`AbstractDatastore`](AbstractDatastore.md).`datastoreType` | [src/datastore/datastore.ts:25](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/datastore.ts#L25) |

## Methods

### addEvents()

> **addEvents**(`events`): [`AbstractHybridDatastore`](AbstractHybridDatastore.md)\<`DocMeta`, `Filter`\>

Add event handlers to the datastore.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | [`Events`](../namespaces/Datastore/interfaces/Events.md)\<`DocMeta`, `Filter`\> |

#### Returns

[`AbstractHybridDatastore`](AbstractHybridDatastore.md)\<`DocMeta`, `Filter`\>

#### Inherited from

[`AbstractDatastore`](AbstractDatastore.md).[`addEvents`](AbstractDatastore.md#addEvents)

#### Source

[src/datastore/datastore.ts:153](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/datastore.ts#L153)

***

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

[src/datastore/datastore.ts:22](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/datastore.ts#L22)

***

### `abstract` deleteAll()

> **`abstract`** **deleteAll**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`AbstractDatastore`](AbstractDatastore.md).[`deleteAll`](AbstractDatastore.md#abstract-deleteAll)

#### Source

[src/datastore/datastore.ts:23](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/datastore.ts#L23)

***

### getEvents()

> **getEvents**(): [`Events`](../namespaces/Datastore/interfaces/Events.md)\<`DocMeta`, `Filter`\>

Get the current event handlers

#### Returns

[`Events`](../namespaces/Datastore/interfaces/Events.md)\<`DocMeta`, `Filter`\>

#### Inherited from

[`AbstractDatastore`](AbstractDatastore.md).[`getEvents`](AbstractDatastore.md#getEvents)

#### Source

[src/datastore/datastore.ts:148](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/datastore.ts#L148)

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

[src/datastore/datastore.ts:53](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/datastore.ts#L53)

***

### setEvents()

> **setEvents**(`events`): [`AbstractHybridDatastore`](AbstractHybridDatastore.md)\<`DocMeta`, `Filter`\>

Set the event handlers to a new set of events. Removes all existing event handlers.
Set to empty object `{}` to remove all events.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | [`Events`](../namespaces/Datastore/interfaces/Events.md)\<`DocMeta`, `Filter`\> |

#### Returns

[`AbstractHybridDatastore`](AbstractHybridDatastore.md)\<`DocMeta`, `Filter`\>

#### Inherited from

[`AbstractDatastore`](AbstractDatastore.md).[`setEvents`](AbstractDatastore.md#setEvents)

#### Source

[src/datastore/datastore.ts:162](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/datastore.ts#L162)

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

[src/datastore/datastore.ts:18](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/datastore.ts#L18)
