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

[src/model/model.ts:48](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L48)

## Properties

| Modifier | Property | Type | Description | Source |
| :------ | :------ | :------ | :------ | :------ |
| `abstract` | `modelProvider` | [`Provider`](../namespaces/Model/type-aliases/Provider.md) | - | [src/model/model.ts:39](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L39) |
| `abstract` | `modelType` | [`Type`](../namespaces/Model/type-aliases/Type.md) | - | [src/model/model.ts:38](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L38) |
| `public` | `tokenizer` | [`ITokenizer`](../namespaces/Model/interfaces/ITokenizer.md) | - | [src/model/model.ts:46](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L46) |

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

[src/model/model.ts:212](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L212)

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

[src/model/model.ts:190](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L190)

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

[src/model/model.ts:34](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L34)

***

### getClient()

> **getClient**(): `MClient`

Get the current client

#### Returns

`MClient`

#### Source

[src/model/model.ts:157](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L157)

***

### getContext()

> **getContext**(): [`Ctx`](../namespaces/Model/type-aliases/Ctx.md)

Get the current context

#### Returns

[`Ctx`](../namespaces/Model/type-aliases/Ctx.md)

#### Source

[src/model/model.ts:168](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L168)

***

### getEvents()

> **getEvents**(): [`Events`](../namespaces/Model/interfaces/Events.md)\<`MRun` & `MConfig`, `MResponse`, `AResponse`\>

Get the current event handlers

#### Returns

[`Events`](../namespaces/Model/interfaces/Events.md)\<`MRun` & `MConfig`, `MResponse`, `AResponse`\>

#### Source

[src/model/model.ts:207](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L207)

***

### getParams()

> **getParams**(): `MConfig` & `Partial`\<`MRun`\>

Get the current params

#### Returns

`MConfig` & `Partial`\<`MRun`\>

#### Source

[src/model/model.ts:185](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L185)

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

[src/model/model.ts:58](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L58)

***

### setCache()

> **setCache**(`cache`): [`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

Set the cache to a new cache. Set to undefined to remove existing.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `cache` | `undefined` \| [`Cache`](../namespaces/Model/interfaces/Cache.md)\<`MRun` & `MConfig`, `MResponse`\> |

#### Returns

[`AbstractModel`](AbstractModel.md)\<`MClient`, `MConfig`, `MRun`, `MResponse`, `AResponse`\>

#### Source

[src/model/model.ts:151](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L151)

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

[src/model/model.ts:162](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L162)

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

[src/model/model.ts:179](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L179)

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

[src/model/model.ts:221](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L221)

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

[src/model/model.ts:200](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L200)

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

[src/model/model.ts:173](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/model.ts#L173)
