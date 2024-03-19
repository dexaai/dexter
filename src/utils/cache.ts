import hashObject from 'hash-object';

export type CacheStorage<KeyType, ValueType extends any> = {
  get: (key: KeyType) => Promise<ValueType | undefined> | ValueType | undefined;
  set: (key: KeyType, value: ValueType) => Promise<unknown> | unknown;
};

export type CacheKey<Params extends Record<string, any>, KeyType = string> = (
  params: Params
) => KeyType | Promise<KeyType>;

export function defaultCacheKey<Params extends Record<string, any>>(
  params: Params
): string {
  return hashObject(params, {
    algorithm: 'sha512',
  });
}
