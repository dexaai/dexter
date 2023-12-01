# Class: PineconeDatastore`<DocMeta>`

## Extends

- [`AbstractDatastore`](AbstractDatastore.md)\<`DocMeta`, `Pinecone.QueryFilter`\<`DocMeta`\>\>

## Type parameters

| Parameter |
| :------ |
| `DocMeta` extends [`BaseMeta`](../namespaces/Datastore/type-aliases/BaseMeta.md) |

## Constructors

### new PineconeDatastore(args)

> **new PineconeDatastore**\<`DocMeta`\>(`args`): [`PineconeDatastore`](PineconeDatastore.md)\<`DocMeta`\>

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `args` | `object` | - |
| `args.cache`? | [`CacheStorage`](../type-aliases/CacheStorage.md)\<`string`, [`QueryResult`](../namespaces/Datastore/interfaces/QueryResult.md)\<`DocMeta`\>\> | Enables caching for queries. Must implement `.get(key)` and `.set(key, value)`, both of which can be either sync or async.<br /><br />Some examples include: `new Map()`, [quick-lru](https://github.com/sindresorhus/quick-lru), or any [keyv adaptor](https://github.com/jaredwray/keyv). |
| `args.cacheKey`? | [`CacheKey`](../type-aliases/CacheKey.md)\<[`Query`](../namespaces/Datastore/interfaces/Query.md)\<`DocMeta`, `QueryFilter`\<`DocMeta`\>\>, `string`\> | A function that returns a cache key for the given params.<br /><br />A simple example would be: `(params) => JSON.stringify(params)`<br /><br />The default `cacheKey` function uses [hash-object](https://github.com/sindresorhus/hash-object) to create a stable sha256 hash of the params. |
| `args.contentKey` | keyof `DocMeta` | The metadata key of the content that is embedded.<br />The value associated with the key must be a string. |
| `args.context`? | [`Ctx`](../namespaces/Datastore/type-aliases/Ctx.md) | - |
| `args.debug`? | `boolean` | Whether or not to add default `console.log` event handlers |
| `args.embeddingModel` | [`EmbeddingModel`](EmbeddingModel.md) | - |
| `args.events`? | [`Events`](../namespaces/Datastore/interfaces/Events.md)\<`DocMeta`, `QueryFilter`\<`DocMeta`\>\> | - |
| `args.namespace`? | `string` | - |
| `args.pinecone`? | `PineconeClient`\<`DocMeta`\> | - |

#### Returns

[`PineconeDatastore`](PineconeDatastore.md)\<`DocMeta`\>

#### Overrides

[`AbstractDatastore`](AbstractDatastore.md).[`constructor`](AbstractDatastore.md#Constructors)

#### Source

[src/datastore/pinecone/datastore.ts:14](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/pinecone/datastore.ts#L14)

## Properties

| Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ |
| `datastoreProvider` | `"pinecone"` | - | [`AbstractDatastore`](AbstractDatastore.md).`datastoreProvider` | [src/datastore/pinecone/datastore.ts:11](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/pinecone/datastore.ts#L11) |
| `datastoreType` | `"embedding"` | - | [`AbstractDatastore`](AbstractDatastore.md).`datastoreType` | [src/datastore/pinecone/datastore.ts:10](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/pinecone/datastore.ts#L10) |

## Methods

### addEvents()

> **addEvents**(`events`): [`PineconeDatastore`](PineconeDatastore.md)\<`DocMeta`\>

Add event handlers to the datastore.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | [`Events`](../namespaces/Datastore/interfaces/Events.md)\<`DocMeta`, `QueryFilter`\<`DocMeta`\>\> |

#### Returns

[`PineconeDatastore`](PineconeDatastore.md)\<`DocMeta`\>

#### Inherited from

[`AbstractDatastore`](AbstractDatastore.md).[`addEvents`](AbstractDatastore.md#addEvents)

#### Source

[src/datastore/datastore.ts:153](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/datastore.ts#L153)

***

### delete()

> **delete**(`docIds`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `docIds` | `string`[] |

#### Returns

`Promise`\<`void`\>

#### Overrides

[`AbstractDatastore`](AbstractDatastore.md).[`delete`](AbstractDatastore.md#abstract-delete)

#### Source

[src/datastore/pinecone/datastore.ts:153](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/pinecone/datastore.ts#L153)

***

### deleteAll()

> **deleteAll**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Overrides

[`AbstractDatastore`](AbstractDatastore.md).[`deleteAll`](AbstractDatastore.md#abstract-deleteAll)

#### Source

[src/datastore/pinecone/datastore.ts:157](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/pinecone/datastore.ts#L157)

***

### getEvents()

> **getEvents**(): [`Events`](../namespaces/Datastore/interfaces/Events.md)\<`DocMeta`, `QueryFilter`\<`DocMeta`\>\>

Get the current event handlers

#### Returns

[`Events`](../namespaces/Datastore/interfaces/Events.md)\<`DocMeta`, `QueryFilter`\<`DocMeta`\>\>

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
| `query` | [`Query`](../namespaces/Datastore/interfaces/Query.md)\<`DocMeta`, `QueryFilter`\<`DocMeta`\>\> |
| `context`? | [`Ctx`](../namespaces/Datastore/type-aliases/Ctx.md) |

#### Returns

`Promise`\<[`QueryResult`](../namespaces/Datastore/interfaces/QueryResult.md)\<`DocMeta`\>\>

#### Inherited from

[`AbstractDatastore`](AbstractDatastore.md).[`query`](AbstractDatastore.md#query)

#### Source

[src/datastore/datastore.ts:53](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/datastore.ts#L53)

***

### runQuery()

> **runQuery**(`query`, `context`?): `Promise`\<[`QueryResult`](../namespaces/Datastore/interfaces/QueryResult.md)\<`DocMeta`\>\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `query` | [`Query`](../namespaces/Datastore/interfaces/Query.md)\<`DocMeta`, `QueryFilter`\<`DocMeta`\>\> |
| `context`? | [`Ctx`](../namespaces/Datastore/type-aliases/Ctx.md) |

#### Returns

`Promise`\<[`QueryResult`](../namespaces/Datastore/interfaces/QueryResult.md)\<`DocMeta`\>\>

#### Overrides

AbstractDatastore.runQuery

#### Source

[src/datastore/pinecone/datastore.ts:30](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/pinecone/datastore.ts#L30)

***

### setEvents()

> **setEvents**(`events`): [`PineconeDatastore`](PineconeDatastore.md)\<`DocMeta`\>

Set the event handlers to a new set of events. Removes all existing event handlers.
Set to empty object `{}` to remove all events.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | [`Events`](../namespaces/Datastore/interfaces/Events.md)\<`DocMeta`, `QueryFilter`\<`DocMeta`\>\> |

#### Returns

[`PineconeDatastore`](PineconeDatastore.md)\<`DocMeta`\>

#### Inherited from

[`AbstractDatastore`](AbstractDatastore.md).[`setEvents`](AbstractDatastore.md#setEvents)

#### Source

[src/datastore/datastore.ts:162](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/datastore.ts#L162)

***

### upsert()

> **upsert**(`docs`, `context`?): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `docs` | [`Doc`](../namespaces/Datastore/interfaces/Doc.md)\<`DocMeta`\>[] |
| `context`? | [`Ctx`](../namespaces/Datastore/type-aliases/Ctx.md) |

#### Returns

`Promise`\<`void`\>

#### Overrides

[`AbstractDatastore`](AbstractDatastore.md).[`upsert`](AbstractDatastore.md#abstract-upsert)

#### Source

[src/datastore/pinecone/datastore.ts:74](https://github.com/dexaai/llm-tools/blob/f300435/src/datastore/pinecone/datastore.ts#L74)
