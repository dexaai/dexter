# Interface: ModelArgs`<MClient, MConfig, MRun, MResponse>`

## Type parameters

| Parameter |
| :------ |
| `MClient` extends [`Client`](../namespaces/Model/namespaces/Base/type-aliases/Client.md) |
| `MConfig` extends [`Config`](../namespaces/Model/namespaces/Base/interfaces/Config.md) |
| `MRun` extends [`Run`](../namespaces/Model/namespaces/Base/interfaces/Run.md) |
| `MResponse` extends [`Response`](../namespaces/Model/namespaces/Base/interfaces/Response.md) |

## Properties

| Property | Type | Description | Source |
| :------ | :------ | :------ | :------ |
| `cache`? | [`CacheStorage`](../type-aliases/CacheStorage.md)\<`string`, `MResponse`\> | Enables caching for model responses. Must implement `.get(key)` and `.set(key, value)`, both of which can be either sync or async.<br /><br />Some examples include: `new Map()`, [quick-lru](https://github.com/sindresorhus/quick-lru), or any [keyv adaptor](https://github.com/jaredwray/keyv). | [src/model/model.ts:29](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/model/model.ts#L29) |
| `cacheKey`? | [`CacheKey`](../type-aliases/CacheKey.md)\<`MRun` & `MConfig`, `string`\> | A function that returns a cache key for the given params.<br /><br />A simple example would be: `(params) => JSON.stringify(params)`<br /><br />The default `cacheKey` function uses [hash-obj](https://github.com/sindresorhus/hash-obj) to create a stable sha256 hash of the params. | [src/model/model.ts:23](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/model/model.ts#L23) |
| `client` | `MClient` | - | [src/model/model.ts:30](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/model/model.ts#L30) |
| `context`? | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) | - | [src/model/model.ts:31](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/model/model.ts#L31) |
| `debug`? | `boolean` | Whether or not to add default `console.log` event handlers | [src/model/model.ts:35](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/model/model.ts#L35) |
| `events`? | [`Events`](../namespaces/Model/interfaces/Events.md)\<`MRun` & `MConfig`, `MResponse`, `any`\> | - | [src/model/model.ts:33](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/model/model.ts#L33) |
| `params` | `MConfig` & `Partial`\<`MRun`\> | - | [src/model/model.ts:32](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/model/model.ts#L32) |
