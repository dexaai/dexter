# Interface: Cache`<MParams, MResponse>`

Cache for storing model responses

## Type parameters

| Parameter |
| :------ |
| `MParams` extends [`Params`](../namespaces/Base/interfaces/Params.md) |
| `MResponse` extends `any` |

## Methods

### get()

> **get**(`key`): `Promise`\<`undefined` \| `null` \| `MResponse`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `MParams` |

#### Returns

`Promise`\<`undefined` \| `null` \| `MResponse`\>

#### Source

[src/model/types.ts:46](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L46)

***

### set()

> **set**(`key`, `value`): `Promise`\<`boolean`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `MParams` |
| `value` | `MResponse` |

#### Returns

`Promise`\<`boolean`\>

#### Source

[src/model/types.ts:47](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/model/types.ts#L47)
