# Class: SparseVectorModel

## Extends

- [`AbstractModel`](AbstractModel.md)\<[`Client`](../namespaces/Model/namespaces/SparseVector/type-aliases/Client.md), [`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md), [`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md), [`Response`](../namespaces/Model/namespaces/SparseVector/interfaces/Response.md)\>

## Constructors

### new SparseVectorModel(args)

> **new SparseVectorModel**(`args`): [`SparseVectorModel`](SparseVectorModel.md)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `object` |
| `args.cache`? | [`Cache`](../namespaces/Model/interfaces/Cache.md)\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/SparseVector/interfaces/Response.md)\> |
| `args.context`? | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |
| `args.debug`? | `boolean` |
| `args.events`? | [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/SparseVector/interfaces/Response.md), `any`\> |
| `args.params` | [`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md)\> |
| `args.serviceUrl`? | `string` |

#### Returns

[`SparseVectorModel`](SparseVectorModel.md)

#### Overrides

[`AbstractModel`](AbstractModel.md).[`constructor`](AbstractModel.md#Constructors)

#### Source

[src/model/sparse-vector.ts:33](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/sparse-vector.ts#L33)

## Properties

| Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ |
| `modelProvider` | `"custom"` | - | [`AbstractModel`](AbstractModel.md).`modelProvider` | [src/model/sparse-vector.ts:30](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/sparse-vector.ts#L30) |
| `modelType` | `"sparse-vector"` | - | [`AbstractModel`](AbstractModel.md).`modelType` | [src/model/sparse-vector.ts:29](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/sparse-vector.ts#L29) |
| `serviceUrl` | `string` | - | - | [src/model/sparse-vector.ts:31](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/sparse-vector.ts#L31) |
| `tokenizer` | [`ITokenizer`](../namespaces/Model/interfaces/ITokenizer.md) | - | [`AbstractModel`](AbstractModel.md).`tokenizer` | [src/model/model.ts:46](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L46) |

## Methods

### addEvents()

> **addEvents**(`events`): [`SparseVectorModel`](SparseVectorModel.md)

Add event handlers to the model.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/SparseVector/interfaces/Response.md), `any`\> |

#### Returns

[`SparseVectorModel`](SparseVectorModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`addEvents`](AbstractModel.md#addEvents)

#### Source

[src/model/model.ts:212](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L212)

***

### addParams()

> **addParams**(`params`): [`SparseVectorModel`](SparseVectorModel.md)

Add the params. Overrides existing keys.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | `Partial`\<[`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md)\>\> |

#### Returns

[`SparseVectorModel`](SparseVectorModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`addParams`](AbstractModel.md#addParams)

#### Source

[src/model/model.ts:190](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L190)

***

### clone()

> **clone**(`args`?): [`SparseVectorModel`](SparseVectorModel.md)

Clone the model and merge/orverride the given properties.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args`? | `object` |
| `args.cache`? | [`Cache`](../namespaces/Model/interfaces/Cache.md)\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/SparseVector/interfaces/Response.md)\> |
| `args.context`? | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |
| `args.debug`? | `boolean` |
| `args.events`? | [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/SparseVector/interfaces/Response.md), `any`\> |
| `args.params`? | [`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md)\> |
| `args.serviceUrl`? | `string` |

#### Returns

[`SparseVectorModel`](SparseVectorModel.md)

#### Overrides

[`AbstractModel`](AbstractModel.md).[`clone`](AbstractModel.md#abstract-clone)

#### Source

[src/model/sparse-vector.ts:105](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/sparse-vector.ts#L105)

***

### getClient()

> **getClient**(): [`Client`](../namespaces/Model/namespaces/SparseVector/type-aliases/Client.md)

Get the current client

#### Returns

[`Client`](../namespaces/Model/namespaces/SparseVector/type-aliases/Client.md)

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

> **getEvents**(): [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/SparseVector/interfaces/Response.md), `any`\>

Get the current event handlers

#### Returns

[`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/SparseVector/interfaces/Response.md), `any`\>

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`getEvents`](AbstractModel.md#getEvents)

#### Source

[src/model/model.ts:207](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L207)

***

### getParams()

> **getParams**(): [`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md)\>

Get the current params

#### Returns

[`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md)\>

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`getParams`](AbstractModel.md#getParams)

#### Source

[src/model/model.ts:185](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L185)

***

### run()

> **run**(`params`, `context`?): `Promise`\<[`Response`](../namespaces/Model/namespaces/SparseVector/interfaces/Response.md)\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | `object` |
| `params.concurrency`? | `number` |
| `params.input`? | `string`[] |
| `params.model`? | `string` |
| `params.throttleInterval`? | `number` |
| `params.throttleLimit`? | `number` |
| `context`? | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |

#### Returns

`Promise`\<[`Response`](../namespaces/Model/namespaces/SparseVector/interfaces/Response.md)\>

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`run`](AbstractModel.md#run)

#### Source

[src/model/model.ts:58](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L58)

***

### setCache()

> **setCache**(`cache`): [`SparseVectorModel`](SparseVectorModel.md)

Set the cache to a new cache. Set to undefined to remove existing.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `cache` | `undefined` \| [`Cache`](../namespaces/Model/interfaces/Cache.md)\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/SparseVector/interfaces/Response.md)\> |

#### Returns

[`SparseVectorModel`](SparseVectorModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setCache`](AbstractModel.md#setCache)

#### Source

[src/model/model.ts:151](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L151)

***

### setClient()

> **setClient**(`client`): [`SparseVectorModel`](SparseVectorModel.md)

Set the client to a new OpenAI API client.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | [`Client`](../namespaces/Model/namespaces/SparseVector/type-aliases/Client.md) |

#### Returns

[`SparseVectorModel`](SparseVectorModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setClient`](AbstractModel.md#setClient)

#### Source

[src/model/model.ts:162](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L162)

***

### setContext()

> **setContext**(`context`): [`SparseVectorModel`](SparseVectorModel.md)

Set the context to a new context. Removes all existing values.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `context` | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |

#### Returns

[`SparseVectorModel`](SparseVectorModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setContext`](AbstractModel.md#setContext)

#### Source

[src/model/model.ts:179](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L179)

***

### setEvents()

> **setEvents**(`events`): [`SparseVectorModel`](SparseVectorModel.md)

Set the event handlers to a new set of events. Removes all existing event handlers.
Set to empty object `{}` to remove all events.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/SparseVector/interfaces/Response.md), `any`\> |

#### Returns

[`SparseVectorModel`](SparseVectorModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setEvents`](AbstractModel.md#setEvents)

#### Source

[src/model/model.ts:221](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L221)

***

### setParams()

> **setParams**(`params`): [`SparseVectorModel`](SparseVectorModel.md)

Set the params to a new params. Removes all existing values.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | [`Config`](../namespaces/Model/namespaces/SparseVector/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/SparseVector/interfaces/Run.md)\> |

#### Returns

[`SparseVectorModel`](SparseVectorModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setParams`](AbstractModel.md#setParams)

#### Source

[src/model/model.ts:200](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L200)

***

### updateContext()

> **updateContext**(`context`): [`SparseVectorModel`](SparseVectorModel.md)

Add the context. Overrides existing keys.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `context` | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |

#### Returns

[`SparseVectorModel`](SparseVectorModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`updateContext`](AbstractModel.md#updateContext)

#### Source

[src/model/model.ts:173](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L173)
