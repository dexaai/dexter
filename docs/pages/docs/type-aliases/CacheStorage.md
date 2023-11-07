# Type alias: CacheStorage`<KeyType, ValueType>`

> **CacheStorage**\<`KeyType`, `ValueType`\>: `object`

## Type parameters

| Parameter |
| :------ |
| `KeyType` |
| `ValueType` extends `any` |

## Type declaration

### get

> **get**: (`key`) => `Promise`\<`ValueType` \| `undefined`\> \| `ValueType` \| `undefined`

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `KeyType` |

#### Returns

`Promise`\<`ValueType` \| `undefined`\> \| `ValueType` \| `undefined`

### set

> **set**: (`key`, `value`) => `Promise`\<`unknown`\> \| `unknown`

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `KeyType` |
| `value` | `ValueType` |

#### Returns

`Promise`\<`unknown`\> \| `unknown`

## Source

[src/utils/cache.ts:3](https://github.com/dexaai/llm-tools/blob/98f7fd5/src/utils/cache.ts#L3)
