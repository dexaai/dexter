# Interface: AIFunction()`<Schema, Return>`

A function meant to be used with OpenAI function calling.

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `Schema` extends `z.ZodObject`\<`any`\> | `z.ZodObject`\<`any`\> |
| `Return` extends `any` | `any` |

> **AIFunction**(`input`): `Promise`\<`Return`\>

The implementation of the function, with arg parsing and validation.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `string` \| [`Msg`](Msg.md) |

## Returns

`Promise`\<`Return`\>

## Source

[src/prompt/types.ts:67](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/types.ts#L67)

## Properties

| Property | Type | Description | Source |
| :------ | :------ | :------ | :------ |
| `argsSchema` | `Schema` | The Zod schema for the arguments string. | [src/prompt/types.ts:69](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/types.ts#L69) |
| `spec` | [`AIFunctionSpec`](AIFunctionSpec.md) | The function spec for the OpenAI API `functions` property. | [src/prompt/types.ts:73](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/types.ts#L73) |

## Methods

### parseArgs()

> **parseArgs**(`input`): `TypeOf`\<`Schema`\>

Parse the function arguments from a message.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `string` \| [`Msg`](Msg.md) |

#### Returns

`TypeOf`\<`Schema`\>

#### Source

[src/prompt/types.ts:71](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/types.ts#L71)
