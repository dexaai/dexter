# Interface: Config

## Extends

- [`Config`](../../Base/interfaces/Config.md).`Omit`\<`EmbeddingParams`, `"input"` \| `"user"`\>

## Properties

| Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ |
| `batch`? | `Partial`\<[`BatchOptions`](BatchOptions.md)\> | - | - | [src/model/types.ts:137](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L137) |
| `model` | `"text-embedding-ada-002"` \| `string` & `object` | - | [`Config`](../../Base/interfaces/Config.md).`model` | [src/model/types.ts:136](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L136) |
| `throttle`? | `Partial`\<`ThrottleOptions`\> | - | - | [src/model/types.ts:138](https://github.com/dexaai/llm-tools/blob/f300435/src/model/types.ts#L138) |
