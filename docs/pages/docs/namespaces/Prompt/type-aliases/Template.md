# Type alias: Template`<T>`

> **Template**\<`T`\>: (`params`) => `Promise`\<[`Msg`](../interfaces/Msg.md)[]\> \| [`Msg`](../interfaces/Msg.md)[]

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `T` | `Record`\<`string`, `any`\> |

Turn structured data into a message.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | `T` |

## Returns

`Promise`\<[`Msg`](../interfaces/Msg.md)[]\> \| [`Msg`](../interfaces/Msg.md)[]

## Source

[src/prompt/types.ts:14](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/prompt/types.ts#L14)
