# Interface: Config

## Extends

- [`Config`](../../Base/interfaces/Config.md).`Omit`\<`EmbeddingParams`, `"input"` \| `"user"`\>

## Properties

| Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ |
| `batch`? | `Partial`\<[`BatchOptions`](BatchOptions.md)\> | - | - | [src/model/types.ts:132](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/model/types.ts#L132) |
| `model` | `"text-embedding-ada-002"` \| `string` & `object` | - | [`Config`](../../Base/interfaces/Config.md).`model` | [src/model/types.ts:131](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/model/types.ts#L131) |
| `throttle`? | `Partial`\<`ThrottleOptions`\> | - | - | [src/model/types.ts:133](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/model/types.ts#L133) |
