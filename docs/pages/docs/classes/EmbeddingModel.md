# Class: EmbeddingModel

## Extends

- [`AbstractModel`](AbstractModel.md)\<[`Client`](../namespaces/Model/namespaces/Embedding/type-aliases/Client.md), [`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md), [`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md), [`Response`](../namespaces/Model/namespaces/Embedding/interfaces/Response.md), [`ApiResponse`](../namespaces/Model/namespaces/Embedding/type-aliases/ApiResponse.md)\>

## Constructors

### new EmbeddingModel(args)

> **new EmbeddingModel**(`args`?): [`EmbeddingModel`](EmbeddingModel.md)

Doesn't accept OpenAIClient because retry needs to be handled at the model level.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args`? | `object` |
| `args.cache`? | [`Cache`](../namespaces/Model/interfaces/Cache.md)\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Embedding/interfaces/Response.md)\> |
| `args.client`? | [`Client`](../namespaces/Model/namespaces/Embedding/type-aliases/Client.md) |
| `args.context`? | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |
| `args.debug`? | `boolean` |
| `args.events`? | [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Embedding/interfaces/Response.md), `any`\> |
| `args.params`? | [`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md)\> |

#### Returns

[`EmbeddingModel`](EmbeddingModel.md)

#### Overrides

[`AbstractModel`](AbstractModel.md).[`constructor`](AbstractModel.md#Constructors)

#### Source

[src/model/embedding.ts:47](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/embedding.ts#L47)

## Properties

| Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ |
| `modelProvider` | `"openai"` | - | [`AbstractModel`](AbstractModel.md).`modelProvider` | [src/model/embedding.ts:43](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/embedding.ts#L43) |
| `modelType` | `"embedding"` | - | [`AbstractModel`](AbstractModel.md).`modelType` | [src/model/embedding.ts:42](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/embedding.ts#L42) |
| `throttledModel` | `BulkEmbedder` | - | - | [src/model/embedding.ts:44](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/embedding.ts#L44) |
| `tokenizer` | [`ITokenizer`](../namespaces/Model/interfaces/ITokenizer.md) | - | [`AbstractModel`](AbstractModel.md).`tokenizer` | [src/model/model.ts:46](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L46) |

## Methods

### addEvents()

> **addEvents**(`events`): [`EmbeddingModel`](EmbeddingModel.md)

Add event handlers to the model.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Embedding/interfaces/Response.md), `CreateEmbeddingResponse`\> |

#### Returns

[`EmbeddingModel`](EmbeddingModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`addEvents`](AbstractModel.md#addEvents)

#### Source

[src/model/model.ts:212](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L212)

***

### addParams()

> **addParams**(`params`): [`EmbeddingModel`](EmbeddingModel.md)

Add the params. Overrides existing keys.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | `Partial`\<[`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md)\>\> |

#### Returns

[`EmbeddingModel`](EmbeddingModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`addParams`](AbstractModel.md#addParams)

#### Source

[src/model/model.ts:190](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L190)

***

### clone()

> **clone**(`args`?): [`EmbeddingModel`](EmbeddingModel.md)

Clone the model and merge/orverride the given properties.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args`? | `object` |
| `args.cache`? | [`Cache`](../namespaces/Model/interfaces/Cache.md)\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Embedding/interfaces/Response.md)\> |
| `args.client`? | [`Client`](../namespaces/Model/namespaces/Embedding/type-aliases/Client.md) |
| `args.context`? | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |
| `args.debug`? | `boolean` |
| `args.events`? | [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Embedding/interfaces/Response.md), `any`\> |
| `args.params`? | [`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md)\> |

#### Returns

[`EmbeddingModel`](EmbeddingModel.md)

#### Overrides

[`AbstractModel`](AbstractModel.md).[`clone`](AbstractModel.md#abstract-clone)

#### Source

[src/model/embedding.ts:153](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/embedding.ts#L153)

***

### getClient()

> **getClient**(): [`Client`](../namespaces/Model/namespaces/Embedding/type-aliases/Client.md)

Get the current client

#### Returns

[`Client`](../namespaces/Model/namespaces/Embedding/type-aliases/Client.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`getClient`](AbstractModel.md#getClient)

#### Source

[src/model/model.ts:157](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L157)

***

### getContext()

> **getContext**(): [`Ctx`](../namespaces/Model/type-aliases/Ctx.md)

Get the current context

#### Returns

[`Ctx`](../namespaces/Model/type-aliases/Ctx.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`getContext`](AbstractModel.md#getContext)

#### Source

[src/model/model.ts:168](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L168)

***

### getEvents()

> **getEvents**(): [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Embedding/interfaces/Response.md), `CreateEmbeddingResponse`\>

Get the current event handlers

#### Returns

[`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Embedding/interfaces/Response.md), `CreateEmbeddingResponse`\>

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`getEvents`](AbstractModel.md#getEvents)

#### Source

[src/model/model.ts:207](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L207)

***

### getParams()

> **getParams**(): [`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md)\>

Get the current params

#### Returns

[`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md)\>

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`getParams`](AbstractModel.md#getParams)

#### Source

[src/model/model.ts:185](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L185)

***

### run()

> **run**(`params`, `context`?): `Promise`\<[`Response`](../namespaces/Model/namespaces/Embedding/interfaces/Response.md)\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | `object` |
| `params.batch`? | `Partial`\<[`BatchOptions`](../namespaces/Model/namespaces/Embedding/interfaces/BatchOptions.md)\> |
| `params.input`? | `string`[] |
| `params.model`? | `"text-embedding-ada-002"` \| `string` & `object` |
| `params.throttle`? | `Partial`\<`ThrottleOptions`\> |
| `context`? | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |

#### Returns

`Promise`\<[`Response`](../namespaces/Model/namespaces/Embedding/interfaces/Response.md)\>

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`run`](AbstractModel.md#run)

#### Source

[src/model/model.ts:58](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L58)

***

### setCache()

> **setCache**(`cache`): [`EmbeddingModel`](EmbeddingModel.md)

Set the cache to a new cache. Set to undefined to remove existing.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `cache` | `undefined` \| [`Cache`](../namespaces/Model/interfaces/Cache.md)\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Embedding/interfaces/Response.md)\> |

#### Returns

[`EmbeddingModel`](EmbeddingModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setCache`](AbstractModel.md#setCache)

#### Source

[src/model/model.ts:151](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L151)

***

### setClient()

> **setClient**(`client`): [`EmbeddingModel`](EmbeddingModel.md)

Set the client to a new OpenAI API client.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | [`Client`](../namespaces/Model/namespaces/Embedding/type-aliases/Client.md) |

#### Returns

[`EmbeddingModel`](EmbeddingModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setClient`](AbstractModel.md#setClient)

#### Source

[src/model/model.ts:162](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L162)

***

### setContext()

> **setContext**(`context`): [`EmbeddingModel`](EmbeddingModel.md)

Set the context to a new context. Removes all existing values.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `context` | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |

#### Returns

[`EmbeddingModel`](EmbeddingModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setContext`](AbstractModel.md#setContext)

#### Source

[src/model/model.ts:179](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L179)

***

### setEvents()

> **setEvents**(`events`): [`EmbeddingModel`](EmbeddingModel.md)

Set the event handlers to a new set of events. Removes all existing event handlers.
Set to empty object `{}` to remove all events.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Embedding/interfaces/Response.md), `CreateEmbeddingResponse`\> |

#### Returns

[`EmbeddingModel`](EmbeddingModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setEvents`](AbstractModel.md#setEvents)

#### Source

[src/model/model.ts:221](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L221)

***

### setParams()

> **setParams**(`params`): [`EmbeddingModel`](EmbeddingModel.md)

Set the params to a new params. Removes all existing values.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | [`Config`](../namespaces/Model/namespaces/Embedding/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/Embedding/interfaces/Run.md)\> |

#### Returns

[`EmbeddingModel`](EmbeddingModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setParams`](AbstractModel.md#setParams)

#### Source

[src/model/model.ts:200](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L200)

***

### updateContext()

> **updateContext**(`context`): [`EmbeddingModel`](EmbeddingModel.md)

Add the context. Overrides existing keys.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `context` | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |

#### Returns

[`EmbeddingModel`](EmbeddingModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`updateContext`](AbstractModel.md#updateContext)

#### Source

[src/model/model.ts:173](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L173)
