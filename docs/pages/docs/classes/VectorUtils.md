# Class: VectorUtils

Utilities for working with vectors/embeddings.

## Constructors

### new VectorUtils()

> **new VectorUtils**(): [`VectorUtils`](VectorUtils.md)

#### Returns

[`VectorUtils`](VectorUtils.md)

## Methods

### cosineSimilarity()

> **`static`** **cosineSimilarity**(`a`, `b`): `number`

Calculate the cosine similarity between two vectors.

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `a` | `number`[] |
| `b` | `number`[] |

#### Returns

`number`

#### Source

[src/datastore/utils/vectors.ts:4](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/datastore/utils/vectors.ts#L4)

***

### dotProduct()

> **`static`** **dotProduct**(`a`, `b`): `number`

Calculate the dot product of two vectors

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `a` | `number`[] |
| `b` | `number`[] |

#### Returns

`number`

#### Source

[src/datastore/utils/vectors.ts:34](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/datastore/utils/vectors.ts#L34)

***

### nearestNeighbors()

> **`static`** **nearestNeighbors**\<`D`\>(`args`): `D` & `object`[]

Find the nearest neighbors of a vector in a set of documents with embeddings.

#### Type parameters

| Parameter |
| :------ |
| `D` extends `object` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `object` |
| `args.distanceFunction`? | `"cosineSimilarity"` \| `"dotProduct"` |
| `args.docs` | `D`[] |
| `args.topK` | `number` |
| `args.vector` | `number`[] |

#### Returns

`D` & `object`[]

The k nearest neighbors of the vector with the similarity score added (sorted by similarity).

#### Source

[src/datastore/utils/vectors.ts:59](https://github.com/dexaai/llm-tools/blob/5a38bb8/src/datastore/utils/vectors.ts#L59)
