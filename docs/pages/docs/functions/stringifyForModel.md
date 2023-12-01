# Function: stringifyForModel()

> **stringifyForModel**(`jsonObject`): `string`

Stringifies a JSON value in a way that's optimized for use with LLM prompts.

This is intended to be used with `function` and `tool` arguments and responses.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `jsonObject` | `void` \| `Jsonifiable` |

## Returns

`string`

## Source

[src/prompt/functions/stringify-for-model.ts:8](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/functions/stringify-for-model.ts#L8)
