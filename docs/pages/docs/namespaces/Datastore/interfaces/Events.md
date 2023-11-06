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
| `onError`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/datastore/types.ts:51](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/types.ts#L51) |
| `onQueryComplete`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/datastore/types.ts:41](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/types.ts#L41) |
| `onQueryStart`? | (`event`) => `void` \| `Promise`\<`void`\>[] | - | [src/datastore/types.ts:34](https://github.com/dexaai/llm-tools/blob/5018eae/src/datastore/types.ts#L34) |
