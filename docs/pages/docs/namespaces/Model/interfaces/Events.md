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
| `onApiResponse`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:165](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/types.ts#L165) |
| `onComplete`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:174](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/types.ts#L174) |
| `onError`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:183](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/types.ts#L183) |
| `onStart`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/model/types.ts:158](https://github.com/dexaai/llm-tools/blob/eeaf162/src/model/types.ts#L158) |
