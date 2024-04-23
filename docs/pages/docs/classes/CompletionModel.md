# Class: CompletionModel

## Extends

- [`AbstractModel`](AbstractModel.md)\<[`Client`](../namespaces/Model/namespaces/Completion/type-aliases/Client.md), [`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md), [`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md), [`Response`](../namespaces/Model/namespaces/Completion/interfaces/Response.md), [`ApiResponse`](../namespaces/Model/namespaces/Completion/type-aliases/ApiResponse.md)\>

## Constructors

### new CompletionModel(args)

> **new CompletionModel**(`args`?): [`CompletionModel`](CompletionModel.md)

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `args`? | `object` | - |
| `args.cache`? | [`CacheStorage`](../type-aliases/CacheStorage.md)\<`string`, [`Response`](../namespaces/Model/namespaces/Completion/interfaces/Response.md)\> | Enables caching for model responses. Must implement `.get(key)` and `.set(key, value)`, both of which can be either sync or async.<br /><br />Some examples include: `new Map()`, [quick-lru](https://github.com/sindresorhus/quick-lru), or any [keyv adaptor](https://github.com/jaredwray/keyv). |
| `args.cacheKey`? | [`CacheKey`](../type-aliases/CacheKey.md)\<[`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md), `string`\> | A function that returns a cache key for the given params.<br /><br />A simple example would be: `(params) => JSON.stringify(params)`<br /><br />The default `cacheKey` function uses [hash-object](https://github.com/sindresorhus/hash-object) to create a stable sha256 hash of the params. |
| `args.client`? | [`Client`](../namespaces/Model/namespaces/Completion/type-aliases/Client.md) | - |
| `args.context`? | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) | - |
| `args.debug`? | `boolean` | Whether or not to add default `console.log` event handlers |
| `args.events`? | [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Completion/interfaces/Response.md), `any`\> | - |
| `args.params`? | [`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md)\> | - |

#### Returns

[`CompletionModel`](CompletionModel.md)

#### Overrides

[`AbstractModel`](AbstractModel.md).[`constructor`](AbstractModel.md#Constructors)

#### Source

[src/model/completion.ts:28](https://github.com/dexaai/llm-tools/blob/f300435/src/model/completion.ts#L28)

## Properties

| Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ |
| `modelProvider` | `"openai"` | - | [`AbstractModel`](AbstractModel.md).`modelProvider` | [src/model/completion.ts:26](https://github.com/dexaai/llm-tools/blob/f300435/src/model/completion.ts#L26) |
| `modelType` | `"completion"` | - | [`AbstractModel`](AbstractModel.md).`modelType` | [src/model/completion.ts:25](https://github.com/dexaai/llm-tools/blob/f300435/src/model/completion.ts#L25) |
| `tokenizer` | [`ITokenizer`](../namespaces/Model/interfaces/ITokenizer.md) | - | [`AbstractModel`](AbstractModel.md).`tokenizer` | [src/model/model.ts:65](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L65) |

## Methods

### addEvents()

> **addEvents**(`events`): [`CompletionModel`](CompletionModel.md)

Add event handlers to the model.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Completion/interfaces/Response.md), `Completion`\> |

#### Returns

[`CompletionModel`](CompletionModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`addEvents`](AbstractModel.md#addEvents)

#### Source

[src/model/model.ts:235](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L235)

***

### addParams()

> **addParams**(`params`): [`CompletionModel`](CompletionModel.md)

Add the params. Overrides existing keys.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | `Partial`\<[`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md)\>\> |

#### Returns

[`CompletionModel`](CompletionModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`addParams`](AbstractModel.md#addParams)

#### Source

[src/model/model.ts:213](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L213)

***

### clone()

> **clone**(`args`?): [`CompletionModel`](CompletionModel.md)

Clone the model and merge/override the given properties.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `args`? | `object` | - |
| `args.cache`? | [`CacheStorage`](../type-aliases/CacheStorage.md)\<`string`, [`Response`](../namespaces/Model/namespaces/Completion/interfaces/Response.md)\> | Enables caching for model responses. Must implement `.get(key)` and `.set(key, value)`, both of which can be either sync or async.<br /><br />Some examples include: `new Map()`, [quick-lru](https://github.com/sindresorhus/quick-lru), or any [keyv adaptor](https://github.com/jaredwray/keyv). |
| `args.cacheKey`? | [`CacheKey`](../type-aliases/CacheKey.md)\<[`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md), `string`\> | A function that returns a cache key for the given params.<br /><br />A simple example would be: `(params) => JSON.stringify(params)`<br /><br />The default `cacheKey` function uses [hash-object](https://github.com/sindresorhus/hash-object) to create a stable sha256 hash of the params. |
| `args.client`? | [`Client`](../namespaces/Model/namespaces/Completion/type-aliases/Client.md) | - |
| `args.context`? | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) | - |
| `args.debug`? | `boolean` | Whether or not to add default `console.log` event handlers |
| `args.events`? | [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Completion/interfaces/Response.md), `any`\> | - |
| `args.params`? | [`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md)\> | - |

#### Returns

[`CompletionModel`](CompletionModel.md)

#### Overrides

[`AbstractModel`](AbstractModel.md).[`clone`](AbstractModel.md#abstract-clone)

#### Source

[src/model/completion.ts:73](https://github.com/dexaai/llm-tools/blob/f300435/src/model/completion.ts#L73)

***

### getClient()

> **getClient**(): [`Client`](../namespaces/Model/namespaces/Completion/type-aliases/Client.md)

Get the current client

#### Returns

[`Client`](../namespaces/Model/namespaces/Completion/type-aliases/Client.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`getClient`](AbstractModel.md#getClient)

#### Source

[src/model/model.ts:180](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L180)

***

### getContext()

> **getContext**(): [`Ctx`](../namespaces/Model/type-aliases/Ctx.md)

Get the current context

#### Returns

[`Ctx`](../namespaces/Model/type-aliases/Ctx.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`getContext`](AbstractModel.md#getContext)

#### Source

[src/model/model.ts:191](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L191)

***

### getEvents()

> **getEvents**(): [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Completion/interfaces/Response.md), `Completion`\>

Get the current event handlers

#### Returns

[`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Completion/interfaces/Response.md), `Completion`\>

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`getEvents`](AbstractModel.md#getEvents)

#### Source

[src/model/model.ts:230](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L230)

***

### getParams()

> **getParams**(): [`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md)\>

Get the current params

#### Returns

[`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md)\>

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`getParams`](AbstractModel.md#getParams)

#### Source

[src/model/model.ts:208](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L208)

***

### run()

> **run**(`params`, `context`?): `Promise`\<[`Response`](../namespaces/Model/namespaces/Completion/interfaces/Response.md)\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | `object` |
| `params.model`? | `"gpt-3.5-turbo-instruct"` \| `"babbage-002"` \| `"davinci-002"` \| `string` & `object` \| `"text-davinci-003"` \| `"text-davinci-002"` \| `"text-davinci-001"` \| `"code-davinci-002"` \| `"text-curie-001"` \| `"text-babbage-001"` \| `"text-ada-001"` |
| `params.prompt`? | `null` \| `string` \| `string`[] \| `number`[] \| `number`[][] |
| `context`? | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |

#### Returns

`Promise`\<[`Response`](../namespaces/Model/namespaces/Completion/interfaces/Response.md)\>

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`run`](AbstractModel.md#run)

#### Source

[src/model/model.ts:78](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L78)

***

### setCache()

> **setCache**(`cache`): [`CompletionModel`](CompletionModel.md)

Set the cache to a new cache. Set to undefined to remove existing.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `cache` | `undefined` \| [`CacheStorage`](../type-aliases/CacheStorage.md)\<`string`, [`Response`](../namespaces/Model/namespaces/Completion/interfaces/Response.md)\> |

#### Returns

[`CompletionModel`](CompletionModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setCache`](AbstractModel.md#setCache)

#### Source

[src/model/model.ts:174](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L174)

***

### setClient()

> **setClient**(`client`): [`CompletionModel`](CompletionModel.md)

Set the client to a new OpenAI API client.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | [`Client`](../namespaces/Model/namespaces/Completion/type-aliases/Client.md) |

#### Returns

[`CompletionModel`](CompletionModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setClient`](AbstractModel.md#setClient)

#### Source

[src/model/model.ts:185](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L185)

***

### setContext()

> **setContext**(`context`): [`CompletionModel`](CompletionModel.md)

Set the context to a new context. Removes all existing values.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `context` | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |

#### Returns

[`CompletionModel`](CompletionModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setContext`](AbstractModel.md#setContext)

#### Source

[src/model/model.ts:202](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L202)

***

### setEvents()

> **setEvents**(`events`): [`CompletionModel`](CompletionModel.md)

Set the event handlers to a new set of events. Removes all existing event handlers.
Set to empty object `{}` to remove all events.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `events` | [`Events`](../namespaces/Model/interfaces/Events.md)\<[`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md), [`Response`](../namespaces/Model/namespaces/Completion/interfaces/Response.md), `Completion`\> |

#### Returns

[`CompletionModel`](CompletionModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setEvents`](AbstractModel.md#setEvents)

#### Source

[src/model/model.ts:244](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L244)

***

### setParams()

> **setParams**(`params`): [`CompletionModel`](CompletionModel.md)

Set the params to a new params. Removes all existing values.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | [`Config`](../namespaces/Model/namespaces/Completion/interfaces/Config.md) & `Partial`\<[`Run`](../namespaces/Model/namespaces/Completion/interfaces/Run.md)\> |

#### Returns

[`CompletionModel`](CompletionModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`setParams`](AbstractModel.md#setParams)

#### Source

[src/model/model.ts:223](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L223)

***

### updateContext()

> **updateContext**(`context`): [`CompletionModel`](CompletionModel.md)

Add the context. Overrides existing keys.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `context` | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) |

#### Returns

[`CompletionModel`](CompletionModel.md)

#### Inherited from

[`AbstractModel`](AbstractModel.md).[`updateContext`](AbstractModel.md#updateContext)

#### Source

[src/model/model.ts:196](https://github.com/dexaai/llm-tools/blob/f300435/src/model/model.ts#L196)
