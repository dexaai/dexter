import hashObject from 'hash-object';
export function defaultCacheKey(params) {
    return hashObject(params, {
        algorithm: 'sha512',
    });
}
//# sourceMappingURL=cache.js.map