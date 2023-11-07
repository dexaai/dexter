# Function: createAIFunction()

> **createAIFunction**\<`Schema`, `Return`\>(`spec`, `implementation`): [`AIFunction`](../namespaces/Prompt/interfaces/AIFunction.md)\<`Schema`, `Return`\>

Create a function meant to be used with OpenAI function calling.

The returned function will parse the arguments string and call the
implementation function with the parsed arguments.

The `spec` property of the returned function is the spec for adding the
function to the OpenAI API `functions` property.

## Type parameters

| Parameter |
| :------ |
| `Schema` extends `ZodObject`\<`any`, `UnknownKeysParam`, `ZodTypeAny`, `object`, `object`\> |
| `Return` extends `unknown` |

## Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `spec` | `object` | - |
| `spec.argsSchema` | `Schema` | Zod schema for the arguments string. |
| `spec.description`? | `string` | Description of the function. |
| `spec.name` | `string` | Name of the function. |
| `implementation` | (`params`) => `Promise`\<`Return`\> | Implementation of the function to call with the parsed arguments. |

## Returns

[`AIFunction`](../namespaces/Prompt/interfaces/AIFunction.md)\<`Schema`, `Return`\>

## Source

[src/prompt/functions/ai-function.ts:16](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/prompt/functions/ai-function.ts#L16)
