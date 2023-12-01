# Function: handleFunctionCallMessage()

> **handleFunctionCallMessage**(`args`): `Promise`\<[`Msg`](../namespaces/Prompt/interfaces/Msg.md)[]\>

Handle messages that require calling functions.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `object` |
| `args.functionCallConcurrency`? | `number` |
| `args.functions`? | [`AIFunction`](../namespaces/Prompt/interfaces/AIFunction.md)\<`ZodObject`\<`any`, `UnknownKeysParam`, `ZodTypeAny`, `object`, `object`\>, `any`\>[] |
| `args.message` | [`Msg`](../namespaces/Prompt/interfaces/Msg.md) |

## Returns

`Promise`\<[`Msg`](../namespaces/Prompt/interfaces/Msg.md)[]\>

An array of the new messages from the function calls
Note: Does not include args.message in the returned array

## Source

[src/prompt/functions/ai-runner.ts:166](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/functions/ai-runner.ts#L166)
