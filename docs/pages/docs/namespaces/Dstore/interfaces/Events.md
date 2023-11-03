# Interface: Events`<DocMeta, Filter>`

Event handlers for logging and debugging

## Type parameters

| Parameter |
| :------ |
| `DocMeta` extends [`BaseMeta`](../type-aliases/BaseMeta.md) |
| `Filter` extends [`BaseFilter`](../type-aliases/BaseFilter.md)\<`DocMeta`\> |

## Properties

| Property | Type | Description | Source |
| :------ | :------ | :------ | :------ |
| `onError`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/datastore/types.ts:64](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L64) |
| `onQueryComplete`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/datastore/types.ts:54](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L54) |
| `onQueryStart`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/datastore/types.ts:47](https://github.com/dexaai/llm-tools/blob/0d08c9c/src/datastore/types.ts#L47) |
