# Interface: Config

## Extends

- [`Config`](../../Base/interfaces/Config.md)

## Properties

| Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ |
| `frequency_penalty`? | `null` \| `number` | - | - | [src/model/types.ts:57](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L57) |
| `function_call`? | `"none"` \| `"auto"` \| `ChatCompletionFunctionCallOption` | - | - | [src/model/types.ts:58](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L58) |
| `functions`? | `Function`[] | - | - | [src/model/types.ts:59](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L59) |
| `handleUpdate`? | (`chunk`) => `void` | - | - | [src/model/types.ts:56](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L56) |
| `logit_bias`? | `null` \| `Record`\<`string`, `number`\> | - | - | [src/model/types.ts:60](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L60) |
| `max_tokens`? | `null` \| `number` | - | - | [src/model/types.ts:61](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L61) |
| `model` | `"gpt-4"` \| `"gpt-4-32k"` \| `"gpt-3.5-turbo"` \| `"gpt-3.5-turbo-16k"` \| `string` & `object` \| `"gpt-4-0314"` \| `"gpt-4-0613"` \| `"gpt-4-32k-0314"` \| `"gpt-4-32k-0613"` \| `"gpt-3.5-turbo-0301"` \| `"gpt-3.5-turbo-0613"` \| `"gpt-3.5-turbo-16k-0613"` | - | [`Config`](../../Base/interfaces/Config.md).`model` | [src/model/types.ts:62](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L62) |
| `presence_penalty`? | `null` \| `number` | - | - | [src/model/types.ts:63](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L63) |
| `response_format`? | `ResponseFormat` | - | - | [src/model/types.ts:64](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L64) |
| `seed`? | `null` \| `number` | - | - | [src/model/types.ts:65](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L65) |
| `stop`? | `null` \| `string` \| `string`[] | - | - | [src/model/types.ts:66](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L66) |
| `temperature`? | `null` \| `number` | - | - | [src/model/types.ts:67](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L67) |
| `tool_choice`? | `ChatCompletionToolChoiceOption` | - | - | [src/model/types.ts:69](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L69) |
| `tools`? | `ChatCompletionTool`[] | - | - | [src/model/types.ts:68](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L68) |
| `top_p`? | `null` \| `number` | - | - | [src/model/types.ts:70](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L70) |
