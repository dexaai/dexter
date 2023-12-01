# Class: `abstract` AbstractModel`<MClient, MConfig, MRun, MResponse, AResponse>`

## Extended By

- [`ChatModel`](ChatModel.md)
- [`CompletionModel`](CompletionModel.md)
- [`EmbeddingModel`](EmbeddingModel.md)
- [`SparseVectorModel`](SparseVectorModel.md)

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `MClient` extends [`Client`](../namespaces/Model/namespaces/Base/type-aliases/Client.md) | - |
| `MConfig` extends [`Config`](../namespaces/Model/namespaces/Base/interfaces/Config.md) | - |
| `MRun` extends [`Run`](../namespaces/Model/namespaces/Base/interfaces/Run.md) | - |
| `MResponse` extends [`Response`](../namespaces/Model/namespaces/Base/interfaces/Response.md) | - |
| `AResponse` extends `any` | `any` |

## Constructors

### new AbstractModel(args)

> **new AbstractModel**\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>(`args`): [`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | [`ModelArgs`](../interfaces/ModelArgs.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`\> |

#### Returns

[`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

#### Source

[src/model/model.ts:67](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L67)

## Properties

| Modifier | Property | Type | Description | Source |
| :------ | :------ | :------ | :------ | :------ |
| `abstract` | `modelProvider` | [`Provider`](../namespaces/Model/type-aliases/Provider.md) | - | [src/model/model.ts:57](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L57) |
| `abstract` | `modelType` | [`Type`](../namespaces/Model/type-aliases/Type.md) | - | [src/model/model.ts:56](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L56) |
| `public` | `tokenizer` | [`ITokenizer`](../namespaces/Model/interfaces/ITokenizer.md) | - | [src/model/model.ts:65](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L65) |

## Methods

### addEvents()

> **addEvents**(`events`): [`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

Add event handlers to the model.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | [`Events`](../namespaces/Model/interfaces/Events.md)\<`MRun` & `MConfig`, `MResponse`, `AResponse`\> |

#### Returns

[`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

#### Source

[src/model/model.ts:235](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L235)

***

### addParams()

> **addParams**(`params`): [`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

Add the params. Overrides existing keys.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | `Partial`\<`MConfig` & `Partial`\<`MRun`\>\> |

#### Returns

[`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

#### Source

[src/model/model.ts:213](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L213)

***

### `abstract` clone()

> **`abstract`** **clone**\<`Args`\>(`args`?): [`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

Clone the model, optionally adding new arguments

#### Type parameters

| Parameter |
| :------ |
| `Args` extends [`ModelArgs`](../interfaces/ModelArgs.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`\> |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args`? | `Args` |

#### Returns

[`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

#### Source

[src/model/model.ts:52](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L52)

***

### getClient()

> **getClient**(): `MClient`

Get the current client

#### Returns

`MClient`

#### Source

[src/model/model.ts:180](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L180)

***

### getContext()

> **getContext**(): [`Ctx`](../namespaces/Model/type-aliases/Ctx.md)

Get the current context

#### Returns

[`Ctx`](../namespaces/Model/type-aliases/Ctx.md)

#### Source

[src/model/model.ts:191](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L191)

***

### getEvents()

> **getEvents**(): [`Events`](../namespaces/Model/interfaces/Events.md)\<`MRun` & `MConfig`, `MResponse`, `AResponse`\>

Get the current event handlers

#### Returns

[`Events`](../namespaces/Model/interfaces/Events.md)\<`MRun` & `MConfig`, `MResponse`, `AResponse`\>

#### Source

[src/model/model.ts:230](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L230)

***

### getParams()

> **getParams**(): `MConfig` & `Partial`\<`MRun`\>

Get the current params

#### Returns

`MConfig` & `Partial`\<`MRun`\>

#### Source

[src/model/model.ts:208](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L208)

***

### run()

> **run**(`params`, `context`?): `Promise`\<`MResponse`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | `{ [K in string | number | symbol]: (MRun & Partial<MConfig>)[K] }` |
| `context`? | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |

#### Returns

`Promise`\<`MResponse`\>

#### Source

[src/model/model.ts:78](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L78)

***

### setCache()

> **setCache**(`cache`): [`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

Set the cache to a new cache. Set to undefined to remove existing.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `cache` | `undefined` \| [`CacheStorage`](../type-aliases/CacheStorage.md)\<`string`, `MResponse`\> |

#### Returns

[`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

#### Source

[src/model/model.ts:174](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L174)

***

### setClient()

> **setClient**(`client`): [`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

Set the client to a new OpenAI API client.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | `MClient` |

#### Returns

[`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

#### Source

[src/model/model.ts:185](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L185)

***

### setContext()

> **setContext**(`context`): [`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

Set the context to a new context. Removes all existing values.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `context` | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |

#### Returns

[`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

#### Source

[src/model/model.ts:202](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L202)

***

### setEvents()

> **setEvents**(`events`): [`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

Set the event handlers to a new set of events. Removes all existing event handlers.
Set to empty object `{}` to remove all events.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | [`Events`](../namespaces/Model/interfaces/Events.md)\<`MRun` & `MConfig`, `MResponse`, `AResponse`\> |

#### Returns

[`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

#### Source

[src/model/model.ts:244](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L244)

***

### setParams()

> **setParams**(`params`): [`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

Set the params to a new params. Removes all existing values.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | `MConfig` & `Partial`\<`MRun`\> |

#### Returns

[`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

#### Source

[src/model/model.ts:223](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L223)

***

### updateContext()

> **updateContext**(`context`): [`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

Add the context. Overrides existing keys.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `context` | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |

#### Returns

[`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

#### Source

[src/model/model.ts:196](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L196)
