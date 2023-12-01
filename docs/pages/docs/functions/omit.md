# Function: omit()

> **omit**\<`T`, `K`\>(`obj`, ...`keys`): `Omit`\<`T`, `K`\>

From `obj`, create a new object that does not include `keys`.

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

`Omit`\<`T`, `K`\>

## Example

```
omit({ a: 1, b: 2, c: 3 }, 'a', 'c') // { b: 2 }
```

## Source

[src/utils/helpers.ts:17](https://github.com/dexaai/llm-tools/blob/f300435/src/utils/helpers.ts#L17)
