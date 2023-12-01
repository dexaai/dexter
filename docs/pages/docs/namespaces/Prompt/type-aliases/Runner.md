# Type alias: Runner`<Content>`

> **Runner**\<`Content`\>: (`params`, `context`?) => `Promise`\<[`Response`](../namespaces/Runner/type-aliases/Response.md)\<`Content`\>\>

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `Content` extends `any` | `string` |

A runner that iteratively calls the model and handles function calls.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | `string` \| [`Params`](../namespaces/Runner/type-aliases/Params.md) |
| `context`? | [`Ctx`](../../Model/type-aliases/Ctx.md) |

## Returns

`Promise`\<[`Response`](../namespaces/Runner/type-aliases/Response.md)\<`Content`\>\>

## Source

[src/prompt/types.ts:9](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/types.ts#L9)
