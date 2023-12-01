# Interface: Events`<MParams, MResponse, AResponse>`

Event handlers for logging and debugging

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `MParams` extends [`Params`](../namespaces/Base/interfaces/Params.md) | - |
| `MResponse` extends [`Response`](../namespaces/Base/interfaces/Response.md) | - |
| `AResponse` extends `any` | `any` |

## Properties

| Property | Type | Description | Source |
| :------ | :------ | :------ | :------ |
| `onApiResponse`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:162](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L162) |
| `onComplete`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:171](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L171) |
| `onError`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:180](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L180) |
| `onStart`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:155](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L155) |
