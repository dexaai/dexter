# Interface: Config

## Extends

- [`Config`](../../Base/interfaces/Config.md).`Omit`\<`EmbeddingParams`, `"input"` \| `"user"`\>

## Properties

| Property | Type | Description | Inheritance | Source |
| :------ | :------ | :------ | :------ | :------ |
| `batch`? | `Partial`\<[`BatchOptions`](BatchOptions.md)\> | - | - | [src/model/types.ts:140](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L140) |
| `model` | `"text-embedding-ada-002"` \| `string` & `object` | - | [`Config`](../../Base/interfaces/Config.md).`model` | [src/model/types.ts:139](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L139) |
| `throttle`? | `Partial`\<`ThrottleOptions`\> | - | - | [src/model/types.ts:141](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L141) |
