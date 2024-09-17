---
title: How to cache responses
---
# Introduction

This document will walk you through the implementation of the caching feature.

The feature introduces a caching mechanism to store and retrieve responses efficiently.

We will cover:

1. The structure of the cache storage.
2. The generation of cache keys.

# Cache storage structure

<SwmSnippet path="/src/utils/cache.ts" line="1">

---

We define a generic \`CacheStorage type to handle the storage and retrieval of cached items. This type includes methods for getting and setting cache entries.

```
import hashObject from 'hash-object';

export type CacheStorage<KeyType, ValueType extends any> = {
  get: (key: KeyType) => Promise<ValueType | undefined> | ValueType | undefined;
  set: (key: KeyType, value: ValueType) => Promise<unknown> | unknown;
};

export type CacheKey<Params extends Record<string, any>, KeyType = string> = (
  params: Params
) => KeyType | Promise<KeyType>;
```

---

</SwmSnippet>

# Cache key generation

<SwmSnippet path="/src/utils/cache.ts" line="11">

---

We implement a default function to generate cache keys. This function uses the <SwmToken path="/src/utils/cache.ts" pos="1:2:2" line-data="import hashObject from &#39;hash-object&#39;;">`hashObject`</SwmToken> library to create a unique hash based on the parameters provided. This ensures that each set of parameters maps to a unique cache key.

```

export function defaultCacheKey<Params extends Record<string, any>>(
  params: Params
): string {
  return hashObject(params, {
    algorithm: 'sha512',
  });
}
```

---

</SwmSnippet>

This approach ensures that our cache keys are consistent and collision-resistant.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZGV4dGVyJTNBJTNBZGV4YWFp" repo-name="dexter"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
