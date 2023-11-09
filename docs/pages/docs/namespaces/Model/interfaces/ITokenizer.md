# Interface: ITokenizer

Generic interface for a model tokenizer

## Methods

### countTokens()

> **countTokens**(`input`?): `number`

Count the number of tokens in a string or ChatMessage(s).
A single ChatMessage is counted as a completion and an array as a prompt.
Strings are counted as is.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input`? | `string` \| `ChatMessage` \| `ChatMessage`[] |

#### Returns

`number`

#### Source

[src/model/types.ts:202](https://github.com/dexaai/llm-tools/blob/3551610/src/model/types.ts#L202)

***

### decode()

> **decode**(`tokens`): `string`

Decode an array of integer tokens into a string

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `tokens` | `number`[] \| `Uint32Array` |

#### Returns

`string`

#### Source

[src/model/types.ts:196](https://github.com/dexaai/llm-tools/blob/3551610/src/model/types.ts#L196)

***

### encode()

> **encode**(`text`): `Uint32Array`

Tokenize a string into an array of integer tokens

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`Uint32Array`

#### Source

[src/model/types.ts:194](https://github.com/dexaai/llm-tools/blob/3551610/src/model/types.ts#L194)

***

### truncate()

> **truncate**(`args`): `string`

Truncate a string to a maximum number of tokens

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `args` | `object` | - |
| `args.from`? | `"start"` \| `"end"` | Truncate from the start or end of the text |
| `args.max` | `number` | Maximum number of tokens to keep (inclusive) |
| `args.text` | `string` | Text to truncate |

#### Returns

`string`

#### Source

[src/model/types.ts:204](https://github.com/dexaai/llm-tools/blob/3551610/src/model/types.ts#L204)
