# Function: calculateCost()

> **calculateCost**(`args`): `number` \| `undefined`

Calculate the cost (in cents) for the given model and tokens.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `object` |
| `args.model` | `string` |
| `args.tokens`? | `object` |
| `args.tokens.completion_tokens`? | `number` |
| `args.tokens.prompt_tokens` | `number` |

## Returns

`number` \| `undefined`

## Source

[src/model/utils/calculate-cost.ts:68](https://github.com/dexaai/llm-tools/blob/f300435/src/model/utils/calculate-cost.ts#L68)
