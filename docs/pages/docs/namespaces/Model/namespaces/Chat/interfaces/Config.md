# Interface: Config

## Extends

- [`Config`](../../Base/interfaces/Config.md)

## Properties

| Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ |
| `frequency_penalty`? | `null` \| `number` | - | - | [src/model/types.ts:64](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L64) |
| `function_call`? | `"none"` \| `"auto"` \| `FunctionCallOption` | - | - | [src/model/types.ts:65](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L65) |
| `functions`? | `Function`[] | - | - | [src/model/types.ts:66](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L66) |
| `handleUpdate`? | (`chunk`) => `void` | - | - | [src/model/types.ts:63](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L63) |
| `logit_bias`? | `null` \| `Record`\<`string`, `number`\> | - | - | [src/model/types.ts:67](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L67) |
| `max_tokens`? | `null` \| `number` | - | - | [src/model/types.ts:68](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L68) |
| `model` | `"gpt-4"` \| `"gpt-4-32k"` \| `"gpt-3.5-turbo"` \| `"gpt-3.5-turbo-16k"` \| `string` & `object` \| `"gpt-4-0314"` \| `"gpt-4-0613"` \| `"gpt-4-32k-0314"` \| `"gpt-4-32k-0613"` \| `"gpt-3.5-turbo-0301"` \| `"gpt-3.5-turbo-0613"` \| `"gpt-3.5-turbo-16k-0613"` | - | [`Config`](../../Base/interfaces/Config.md).`model` | [src/model/types.ts:69](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L69) |
| `presence_penalty`? | `null` \| `number` | - | - | [src/model/types.ts:70](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L70) |
| `stop`? | `null` \| `string` \| `string`[] | - | - | [src/model/types.ts:71](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L71) |
| `temperature`? | `null` \| `number` | - | - | [src/model/types.ts:72](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L72) |
| `top_p`? | `null` \| `number` | - | - | [src/model/types.ts:73](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L73) |
