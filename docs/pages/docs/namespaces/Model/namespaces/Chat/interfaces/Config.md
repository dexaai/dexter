# Interface: Config

## Extends

- [`Config`](../../Base/interfaces/Config.md)

## Properties

| Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ |
| `frequency_penalty`? | `null` \| `number` | - | - | [src/model/types.ts:56](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L56) |
| `function_call`? | `"none"` \| `"auto"` \| `FunctionCallOption` | - | - | [src/model/types.ts:57](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L57) |
| `functions`? | `Function`[] | - | - | [src/model/types.ts:58](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L58) |
| `handleUpdate`? | (`chunk`) => `void` | - | - | [src/model/types.ts:55](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L55) |
| `logit_bias`? | `null` \| `Record`\<`string`, `number`\> | - | - | [src/model/types.ts:59](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L59) |
| `max_tokens`? | `null` \| `number` | - | - | [src/model/types.ts:60](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L60) |
| `model` | `"gpt-4"` \| `"gpt-4-32k"` \| `"gpt-3.5-turbo"` \| `"gpt-3.5-turbo-16k"` \| `string` & `object` \| `"gpt-4-0314"` \| `"gpt-4-0613"` \| `"gpt-4-32k-0314"` \| `"gpt-4-32k-0613"` \| `"gpt-3.5-turbo-0301"` \| `"gpt-3.5-turbo-0613"` \| `"gpt-3.5-turbo-16k-0613"` | - | [`Config`](../../Base/interfaces/Config.md).`model` | [src/model/types.ts:61](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L61) |
| `presence_penalty`? | `null` \| `number` | - | - | [src/model/types.ts:62](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L62) |
| `stop`? | `null` \| `string` \| `string`[] | - | - | [src/model/types.ts:63](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L63) |
| `temperature`? | `null` \| `number` | - | - | [src/model/types.ts:64](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L64) |
| `top_p`? | `null` \| `number` | - | - | [src/model/types.ts:65](https://github.com/dexaai/llm-tools/blob/5018eae/src/model/types.ts#L65) |
