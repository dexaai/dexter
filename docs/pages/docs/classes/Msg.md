# Class: Msg

Utility class for creating and checking message types.

## Constructors

### new Msg()

> **new Msg**(): [`Msg`](Msg.md)

#### Returns

[`Msg`](Msg.md)

## Methods

### assistant()

> **`static`** **assistant**(`content`, `opts`?): [`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md)

Create an assistant message. Cleans indentation and newlines by default.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `content` | `string` | - |
| `opts`? | `object` | - |
| `opts.cleanContent`? | `boolean` | Whether to clean extra newlines and indentation. Defaults to true. |
| `opts.name`? | `string` | Custom name for the message. |

#### Returns

[`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md)

#### Source

[src/prompt/utils/message.ts:56](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L56)

***

### funcCall()

> **`static`** **funcCall**(`function_call`, `opts`?): [`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md)

Create a function call message with argumets.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `function_call` | `object` | - |
| `function_call.arguments` | `string` | Arguments to pass to the function. |
| `function_call.name`? | `string` | Name of the function to call. |
| `opts`? | `object` | - |
| `opts.name`? | `string` | The name descriptor for the message.(message.name) |

#### Returns

[`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md)

#### Source

[src/prompt/utils/message.ts:74](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L74)

***

### funcResult()

> **`static`** **funcResult**(`content`, `name`): [`FuncResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncResult.md)

Create a function result message.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `content` | `Jsonifiable` |
| `name` | `string` |

#### Returns

[`FuncResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncResult.md)

#### Source

[src/prompt/utils/message.ts:95](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L95)

***

### getMessage()

> **`static`** **getMessage**(`response`): [`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md) \| [`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md) \| [`ToolCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/ToolCall.md)

Get the narrowed message from an EnrichedResponse.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `response` | `any` |

#### Returns

[`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md) \| [`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md) \| [`ToolCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/ToolCall.md)

#### Source

[src/prompt/utils/message.ts:130](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L130)

***

### isAssistant()

> **`static`** **isAssistant**(`message`): `message is Assistant`

Check if a message is an assistant message.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`Msg`](../namespaces/Prompt/interfaces/Msg.md) |

#### Returns

`message is Assistant`

#### Source

[src/prompt/utils/message.ts:165](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L165)

***

### isFuncCall()

> **`static`** **isFuncCall**(`message`): `message is FuncCall`

Check if a message is a function call message with arguments.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`Msg`](../namespaces/Prompt/interfaces/Msg.md) |

#### Returns

`message is FuncCall`

#### Source

[src/prompt/utils/message.ts:169](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L169)

***

### isFuncResult()

> **`static`** **isFuncResult**(`message`): `message is FuncResult`

Check if a message is a function result message.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`Msg`](../namespaces/Prompt/interfaces/Msg.md) |

#### Returns

`message is FuncResult`

#### Source

[src/prompt/utils/message.ts:173](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L173)

***

### isSystem()

> **`static`** **isSystem**(`message`): `message is System`

Check if a message is a system message.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`Msg`](../namespaces/Prompt/interfaces/Msg.md) |

#### Returns

`message is System`

#### Source

[src/prompt/utils/message.ts:157](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L157)

***

### isToolCall()

> **`static`** **isToolCall**(`message`): `message is ToolCall`

Check if a message is a tool calls message.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`Msg`](../namespaces/Prompt/interfaces/Msg.md) |

#### Returns

`message is ToolCall`

#### Source

[src/prompt/utils/message.ts:177](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L177)

***

### isToolResult()

> **`static`** **isToolResult**(`message`): `message is ToolResult`

Check if a message is a tool call result message.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`Msg`](../namespaces/Prompt/interfaces/Msg.md) |

#### Returns

`message is ToolResult`

#### Source

[src/prompt/utils/message.ts:181](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L181)

***

### isUser()

> **`static`** **isUser**(`message`): `message is User`

Check if a message is a user message.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`Msg`](../namespaces/Prompt/interfaces/Msg.md) |

#### Returns

`message is User`

#### Source

[src/prompt/utils/message.ts:161](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L161)

***

### narrow()

#### narrow(message)

> **`static`** **narrow**(`message`): [`System`](../namespaces/Prompt/namespaces/Msg/type-aliases/System.md)

Narrow a ChatModel.Message to a specific type.

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`System`](../namespaces/Prompt/namespaces/Msg/type-aliases/System.md) |

##### Returns

[`System`](../namespaces/Prompt/namespaces/Msg/type-aliases/System.md)

##### Source

[src/prompt/utils/message.ts:186](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L186)

#### narrow(message)

> **`static`** **narrow**(`message`): [`User`](../namespaces/Prompt/namespaces/Msg/type-aliases/User.md)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`User`](../namespaces/Prompt/namespaces/Msg/type-aliases/User.md) |

##### Returns

[`User`](../namespaces/Prompt/namespaces/Msg/type-aliases/User.md)

##### Source

[src/prompt/utils/message.ts:187](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L187)

#### narrow(message)

> **`static`** **narrow**(`message`): [`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md) |

##### Returns

[`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md)

##### Source

[src/prompt/utils/message.ts:188](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L188)

#### narrow(message)

> **`static`** **narrow**(`message`): [`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md) |

##### Returns

[`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md)

##### Source

[src/prompt/utils/message.ts:189](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L189)

#### narrow(message)

> **`static`** **narrow**(`message`): [`FuncResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncResult.md)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`FuncResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncResult.md) |

##### Returns

[`FuncResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncResult.md)

##### Source

[src/prompt/utils/message.ts:190](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L190)

#### narrow(message)

> **`static`** **narrow**(`message`): [`ToolCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/ToolCall.md)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`ToolCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/ToolCall.md) |

##### Returns

[`ToolCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/ToolCall.md)

##### Source

[src/prompt/utils/message.ts:191](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L191)

#### narrow(message)

> **`static`** **narrow**(`message`): [`ToolResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/ToolResult.md)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`ToolResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/ToolResult.md) |

##### Returns

[`ToolResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/ToolResult.md)

##### Source

[src/prompt/utils/message.ts:192](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L192)

***

### narrowResponseMessage()

> **`static`** **narrowResponseMessage**(`msg`): [`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md) \| [`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md) \| [`ToolCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/ToolCall.md)

Narrow a message received from the API. It only responds with role=assistant

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `msg` | [`Msg`](../namespaces/Prompt/interfaces/Msg.md) |

#### Returns

[`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md) \| [`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md) \| [`ToolCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/ToolCall.md)

#### Source

[src/prompt/utils/message.ts:140](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L140)

***

### system()

> **`static`** **system**(`content`, `opts`?): [`System`](../namespaces/Prompt/namespaces/Msg/type-aliases/System.md)

Create a system message. Cleans indentation and newlines by default.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `content` | `string` | - |
| `opts`? | `object` | - |
| `opts.cleanContent`? | `boolean` | Whether to clean extra newlines and indentation. Defaults to true. |
| `opts.name`? | `string` | Custom name for the message. |

#### Returns

[`System`](../namespaces/Prompt/namespaces/Msg/type-aliases/System.md)

#### Source

[src/prompt/utils/message.ts:20](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L20)

***

### toolCall()

> **`static`** **toolCall**(`tool_calls`, `opts`?): [`ToolCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/ToolCall.md)

Create a function call message with argumets.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `tool_calls` | [`Tool`](../namespaces/Prompt/namespaces/Msg/namespaces/Call/type-aliases/Tool.md)[] | - |
| `opts`? | `object` | - |
| `opts.name`? | `string` | The name descriptor for the message.(message.name) |

#### Returns

[`ToolCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/ToolCall.md)

#### Source

[src/prompt/utils/message.ts:101](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L101)

***

### toolResult()

> **`static`** **toolResult**(`content`, `tool_call_id`, `opts`?): [`ToolResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/ToolResult.md)

Create a tool call result message.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `content` | `Jsonifiable` | - |
| `tool_call_id` | `string` | - |
| `opts`? | `object` | - |
| `opts.name`? | `string` | The name of the tool which was called |

#### Returns

[`ToolResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/ToolResult.md)

#### Source

[src/prompt/utils/message.ts:117](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L117)

***

### user()

> **`static`** **user**(`content`, `opts`?): [`User`](../namespaces/Prompt/namespaces/Msg/type-aliases/User.md)

Create a user message. Cleans indentation and newlines by default.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `content` | `string` | - |
| `opts`? | `object` | - |
| `opts.cleanContent`? | `boolean` | Whether to clean extra newlines and indentation. Defaults to true. |
| `opts.name`? | `string` | Custom name for the message. |

#### Returns

[`User`](../namespaces/Prompt/namespaces/Msg/type-aliases/User.md)

#### Source

[src/prompt/utils/message.ts:38](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/message.ts#L38)
