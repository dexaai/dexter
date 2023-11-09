# Class: PineconeHybridDatastore`<DocMeta>`

## Extends

- [`AbstractHybridDatastore`](AbstractHybridDatastore.md)\<`DocMeta`, `Pinecone.QueryFilter`\<`DocMeta`\>\>

## Type parameters

| Parameter |
| :------ |
| `DocMeta` extends [`BaseMeta`](../namespaces/Datastore/type-aliases/BaseMeta.md) |

## Constructors

### new PineconeHybridDatastore(args)

> **new PineconeHybridDatastore**\<`DocMeta`\>(`args`): [`PineconeHybridDatastore`](PineconeHybridDatastore.md)\<`DocMeta`\>

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
| `args.spladeModel` | [`SparseVectorModel`](SparseVectorModel.md) | Splade instance for creating sparse vectors |

#### Returns

[`PineconeHybridDatastore`](PineconeHybridDatastore.md)\<`DocMeta`\>

#### Overrides

[`AbstractHybridDatastore`](AbstractHybridDatastore.md).[`constructor`](AbstractHybridDatastore.md#Constructors)

#### Source

[src/datastore/pinecone/hybrid-datastore.ts:15](https://github.com/dexaai/llm-tools/blob/3551610/src/datastore/pinecone/hybrid-datastore.ts#L15)

## Properties

| Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ |
| `datastoreProvider` | `"pinecone"` | - | [`AbstractHybridDatastore`](AbstractHybridDatastore.md).`datastoreProvider` | [src/datastore/pinecone/hybrid-datastore.ts:12](https://github.com/dexaai/llm-tools/blob/3551610/src/datastore/pinecone/hybrid-datastore.ts#L12) |
| `datastoreType` | `"hybrid"` | - | [`AbstractHybridDatastore`](AbstractHybridDatastore.md).`datastoreType` | [src/datastore/pinecone/hybrid-datastore.ts:11](https://github.com/dexaai/llm-tools/blob/3551610/src/datastore/pinecone/hybrid-datastore.ts#L11) |

## Methods

### delete()

> **delete**(`docIds`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `docIds` | `string`[] |

#### Returns

`Promise`\<`void`\>

#### Overrides

[`AbstractHybridDatastore`](AbstractHybridDatastore.md).[`delete`](AbstractHybridDatastore.md#abstract-delete)

#### Source

[src/datastore/pinecone/hybrid-datastore.ts:176](https://github.com/dexaai/llm-tools/blob/3551610/src/datastore/pinecone/hybrid-datastore.ts#L176)

***

### deleteAll()

> **deleteAll**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Overrides

[`AbstractHybridDatastore`](AbstractHybridDatastore.md).[`deleteAll`](AbstractHybridDatastore.md#abstract-deleteAll)

#### Source

[src/datastore/pinecone/hybrid-datastore.ts:180](https://github.com/dexaai/llm-tools/blob/3551610/src/datastore/pinecone/hybrid-datastore.ts#L180)

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

[`AbstractHybridDatastore`](AbstractHybridDatastore.md).[`query`](AbstractHybridDatastore.md#query)

#### Source

[src/datastore/datastore.ts:53](https://github.com/dexaai/llm-tools/blob/3551610/src/datastore/datastore.ts#L53)

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

AbstractHybridDatastore.runQuery

#### Source

[src/datastore/pinecone/hybrid-datastore.ts:31](https://github.com/dexaai/llm-tools/blob/3551610/src/datastore/pinecone/hybrid-datastore.ts#L31)

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

[`AbstractHybridDatastore`](AbstractHybridDatastore.md).[`upsert`](AbstractHybridDatastore.md#abstract-upsert)

#### Source

[src/datastore/pinecone/hybrid-datastore.ts:89](https://github.com/dexaai/llm-tools/blob/3551610/src/datastore/pinecone/hybrid-datastore.ts#L89)
