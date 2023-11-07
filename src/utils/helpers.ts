import { deepmerge as deepmergeInit } from '@fastify/deepmerge';

/** Improve preview of union types in autocomplete. */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

type DeepMerge = ReturnType<typeof deepmergeInit>;
export const deepMerge: DeepMerge = deepmergeInit();

/**
 * From `obj`, create a new object that does not include `keys`.
 *
 * @example
 * ```
 * omit({ a: 1, b: 2, c: 3 }, 'a', 'c') // { b: 2 }
 * ```
 */
export const omit = <T extends Record<any, unknown>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> =>
  Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keys.includes(k as any))
  ) as any;

/**
 * From `obj`, create a new object that only includes `keys`.
 *
 * @example
 * ```
 * pick({ a: 1, b: 2, c: 3 }, 'a', 'c') // { a: 1, c: 3 }
 * ```
 */
export const pick = <T extends Record<any, unknown>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> =>
  Object.fromEntries(
    Object.entries(obj).filter(([k]) => keys.includes(k as any))
  ) as any;
