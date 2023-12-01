# Function: createAIExtractFunction()

> **createAIExtractFunction**\<`Schema`\>(`__namedParameters`, `customExtractImplementation`?): [`ExtractFunction`](../namespaces/Prompt/type-aliases/ExtractFunction.md)\<`Schema`\>

Use OpenAI function calling to extract data from a message.

## Type parameters

| Parameter |
| :------ |
| `Schema` extends `ZodObject`\<`any`, `UnknownKeysParam`, `ZodTypeAny`, `object`, `object`\> |

## Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `__namedParameters` | `object` | - |
| `__namedParameters.chatModel` | [`ChatModel`](../classes/ChatModel.md) | The ChatModel used to make API calls. |
| `__namedParameters.context`? | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) | Optional context to pass to ChatModel.run calls |
| `__namedParameters.description`? | `string` | The description of the extractor function. |
| `__namedParameters.functionCallConcurrency`? | `number` | The number of function calls to make concurrently. |
| `__namedParameters.maxRetries`? | `number` | The maximum number of times to retry the function call. |
| `__namedParameters.name`? | `string` | The name of the extractor function. |
| `__namedParameters.params`? | `Partial`\<`Omit`\<[`Run`](../namespaces/Model/namespaces/Chat/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Chat/interfaces/Config.md), `"messages"` \| `"functions"` \| `"tools"`\>\> | Model params to use for each API call (optional). |
| `__namedParameters.schema`? | `Schema` | The Zod schema for the data to extract. |
| `__namedParameters.systemMessage`? | `string` | Add a system message to the beginning of the messages array. |
| `customExtractImplementation`? | (`params`) => `TypeOf`\<`Schema`\> \| `Promise`\<`TypeOf`\<`Schema`\>\> | Optional custom extraction function to call with the parsed arguments.<br /><br />This is useful for adding custom validation to the extracted data. |

## Returns

[`ExtractFunction`](../namespaces/Prompt/type-aliases/ExtractFunction.md)\<`Schema`\>

## Source

[src/prompt/functions/ai-extract-function.ts:10](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/functions/ai-extract-function.ts#L10)
