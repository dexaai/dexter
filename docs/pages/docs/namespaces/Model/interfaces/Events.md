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
| `onApiResponse`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:161](https://github.com/dexaai/llm-tools/blob/3551610/src/model/types.ts#L161) |
| `onComplete`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:170](https://github.com/dexaai/llm-tools/blob/3551610/src/model/types.ts#L170) |
| `onError`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:179](https://github.com/dexaai/llm-tools/blob/3551610/src/model/types.ts#L179) |
| `onStart`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:154](https://github.com/dexaai/llm-tools/blob/3551610/src/model/types.ts#L154) |
