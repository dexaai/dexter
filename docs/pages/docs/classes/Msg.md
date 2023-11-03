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

[src/prompt/utils/message.ts:52](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L52)

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

[src/prompt/utils/message.ts:70](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L70)

***

### funcResult()

> **`static`** **funcResult**(`content`, `name`): [`FuncResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncResult.md)

Create a function result message.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `content` | `string` \| `object` \| `unknown`[] |
| `name` | `string` |

#### Returns

[`FuncResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncResult.md)

#### Source

[src/prompt/utils/message.ts:92](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L92)

***

### getMessage()

> **`static`** **getMessage**(`response`): [`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md) \| [`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md)

Get the narrowed message from an EnrichedResponse.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `response` | `any` |

#### Returns

[`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md) \| [`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md)

#### Source

[src/prompt/utils/message.ts:102](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L102)

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

[src/prompt/utils/message.ts:135](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L135)

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

[src/prompt/utils/message.ts:139](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L139)

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

[src/prompt/utils/message.ts:143](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L143)

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

[src/prompt/utils/message.ts:127](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L127)

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

[src/prompt/utils/message.ts:131](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L131)

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

[src/prompt/utils/message.ts:148](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L148)

#### narrow(message)

> **`static`** **narrow**(`message`): [`User`](../namespaces/Prompt/namespaces/Msg/type-aliases/User.md)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`User`](../namespaces/Prompt/namespaces/Msg/type-aliases/User.md) |

##### Returns

[`User`](../namespaces/Prompt/namespaces/Msg/type-aliases/User.md)

##### Source

[src/prompt/utils/message.ts:149](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L149)

#### narrow(message)

> **`static`** **narrow**(`message`): [`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md) |

##### Returns

[`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md)

##### Source

[src/prompt/utils/message.ts:150](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L150)

#### narrow(message)

> **`static`** **narrow**(`message`): [`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md) |

##### Returns

[`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md)

##### Source

[src/prompt/utils/message.ts:151](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L151)

#### narrow(message)

> **`static`** **narrow**(`message`): [`FuncResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncResult.md)

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | [`FuncResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncResult.md) |

##### Returns

[`FuncResult`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncResult.md)

##### Source

[src/prompt/utils/message.ts:152](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L152)

***

### narrowResponseMessage()

> **`static`** **narrowResponseMessage**(`msg`): [`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md) \| [`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md)

Narrow a message received from the API. It only responds with role=assistant

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `msg` | [`Msg`](../namespaces/Prompt/interfaces/Msg.md) |

#### Returns

[`Assistant`](../namespaces/Prompt/namespaces/Msg/type-aliases/Assistant.md) \| [`FuncCall`](../namespaces/Prompt/namespaces/Msg/type-aliases/FuncCall.md)

#### Source

[src/prompt/utils/message.ts:112](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L112)

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

[src/prompt/utils/message.ts:16](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L16)

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

[src/prompt/utils/message.ts:34](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/utils/message.ts#L34)
