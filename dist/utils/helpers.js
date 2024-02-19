import { deepmerge as deepmergeInit } from '@fastify/deepmerge';
export const deepMerge = deepmergeInit();
/**
 * From `obj`, create a new object that does not include `keys`.
 *
 * @example
 * ```
 * omit({ a: 1, b: 2, c: 3 }, 'a', 'c') // { b: 2 }
 * ```
 */
export const omit = (obj, ...keys) => Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
/**
 * From `obj`, create a new object that only includes `keys`.
 *
 * @example
 * ```
 * pick({ a: 1, b: 2, c: 3 }, 'a', 'c') // { a: 1, c: 3 }
 * ```
 */
export const pick = (obj, ...keys) => Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)));
//# sourceMappingURL=helpers.js.map