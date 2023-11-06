# Function: pick()

> **pick**\<`T`, `K`\>(`obj`, ...`keys`): `Pick`\<`T`, `K`\>

From `obj`, create a new object that only includes `keys`.

## Type parameters

| Parameter |
| :------ |
| `T` extends `Record`\<`any`, `unknown`\> |
| `K` extends `string` \| `number` \| `symbol` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `obj` | `T` |
| ...`keys` | `K`[] |

## Returns

`Pick`\<`T`, `K`\>

## Example

```
pick({ a: 1, b: 2, c: 3 }, 'a', 'c') // { a: 1, c: 3 }
```

## Source

[src/utils/helpers.ts:33](https://github.com/dexaai/llm-tools/blob/2b78745/src/utils/helpers.ts#L33)
