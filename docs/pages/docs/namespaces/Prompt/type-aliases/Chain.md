# Type alias: Chain`<Args, Result>`

> **Chain**\<`Args`, `Result`\>: (`args`) => `Promise`\<`Result`\>

## Type parameters

| Parameter |
| :------ |
| `Args` extends `Record`\<`string`, `any`\> |
| `Result` extends `any` |

A prompt chain that coordinates the template, functions, and validator.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `Args` |

## Returns

`Promise`\<`Result`\>

## Source

[src/prompt/types.ts:7](https://github.com/dexaai/llm-tools/blob/2a387dc/src/prompt/types.ts#L7)
