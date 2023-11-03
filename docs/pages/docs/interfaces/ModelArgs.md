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
| `cache`? | [`Cache`](../namespaces/Model/interfaces/Cache.md)\<`MRun` & `MConfig`, `MResponse`\> | - | [src/model/model.ts:12](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L12) |
| `client` | `MClient` | - | [src/model/model.ts:13](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L13) |
| `context`? | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) | - | [src/model/model.ts:14](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L14) |
| `debug`? | `boolean` | - | [src/model/model.ts:17](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L17) |
| `events`? | [`Events`](../namespaces/Model/interfaces/Events.md)\<`MRun` & `MConfig`, `MResponse`, `any`\> | - | [src/model/model.ts:16](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L16) |
| `params` | `MConfig` & `Partial`\<`MRun`\> | - | [src/model/model.ts:15](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/model.ts#L15) |
