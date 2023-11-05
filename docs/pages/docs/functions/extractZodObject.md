# Function: extractZodObject()

> **extractZodObject**\<`Schema`\>(`args`): `z.infer`\<`Schema`\>

Extract an object from a JSON string and validate it against a Zod schema.
Throws an error with a message optimized for GPT readability if it fails.

## Type parameters

| Parameter |
| :------ |
| `Schema` extends `ZodObject`\<`any`, `UnknownKeysParam`, `ZodTypeAny`, `object`, `object`\> |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `object` |
| `args.json` | `string` |
| `args.schema` | `Schema` |

## Returns

`z.infer`\<`Schema`\>

## Source

[src/prompt/functions/extract-zod-object.ts:9](https://github.com/dexaai/llm-tools/blob/eeaf162/src/prompt/functions/extract-zod-object.ts#L9)
