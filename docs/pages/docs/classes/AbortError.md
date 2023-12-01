# Class: AbortError

## Extends

- `Error`

## Constructors

### new AbortError(message)

> **new AbortError**(`message`): [`AbortError`](AbortError.md)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` \| `Error` |

#### Returns

[`AbortError`](AbortError.md)

#### Overrides

Error.constructor

#### Source

[src/prompt/utils/errors.ts:5](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/errors.ts#L5)

## Properties

| Modifier | Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ | :------ |
| `readonly` | `name` | `"AbortError"` | - | Error.name | [src/prompt/utils/errors.ts:2](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/errors.ts#L2) |
| `readonly` | `originalError` | `Error` | - | - | [src/prompt/utils/errors.ts:3](https://github.com/dexaai/llm-tools/blob/f300435/src/prompt/utils/errors.ts#L3) |
