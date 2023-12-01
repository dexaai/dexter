# Function: createAIRunner()

> **createAIRunner**\<`Content`\>(`args`): [`Runner`](../namespaces/Prompt/type-aliases/Runner.md)\<`Content`\>

Creates a function to run a chat model in a loop
- Handles parsing, running, and inserting responses for function & tool call messages
- Handles errors by adding a message with the error and rerunning the model
- Optionally validates the content of the last message

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `Content` extends `unknown` | `string` |

## Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `args` | `object` | - |
| `args.chatModel` | [`ChatModel`](../classes/ChatModel.md) | The ChatModel used to make API calls. |
| `args.context`? | [`Ctx`](../namespaces/Model/type-aliases/Ctx.md) | Optional context to pass to ChatModel.run calls |
| `args.functionCallConcurrency`? | `number` | The number of function calls to make concurrently. |
| `args.functions`? | [`AIFunction`](../namespaces/Prompt/interfaces/AIFunction.md)\<`ZodObject`\<`any`, `UnknownKeysParam`, `ZodTypeAny`, `object`, `object`\>, `any`\>[] | The functions the model can call. |
| `args.maxIterations`? | `number` | The maximum number of iterations before the runner throws an error. An iteration is a single call to the model/API. |
| `args.mode`? | [`Mode`](../namespaces/Prompt/namespaces/Runner/type-aliases/Mode.md) | Controls whether functions or tool_calls are used. |
| `args.params`? | `Partial`\<`Omit`\<[`Run`](../namespaces/Model/namespaces/Chat/interfaces/Run.md) & [`Config`](../namespaces/Model/namespaces/Chat/interfaces/Config.md), `"messages"` \| `"functions"` \| `"tools"`\>\> | Model params to use for each API call (optional). |
| `args.shouldBreakLoop`? | (`msg`) => `boolean` | - |
| `args.systemMessage`? | `string` | Add a system message to the beginning of the messages array. |
| `args.validateContent`? | (`content`) => `Content` \| `Promise`\<`Content`\> | - |

## Returns

[`Runner`](../namespaces/Prompt/type-aliases/Runner.md)\<`Content`\>

## Source

[src/prompt/functions/ai-runner.ts:12](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/functions/ai-runner.ts#L12)
