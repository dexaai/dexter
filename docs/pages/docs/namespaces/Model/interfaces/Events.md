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
| `onApiResponse`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:157](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L157) |
| `onComplete`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:166](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L166) |
| `onError`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:175](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L175) |
| `onStart`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:150](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L150) |
