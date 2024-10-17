import { deepmerge as deepmergeInit } from '@fastify/deepmerge';

/** Improve preview of union types in autocomplete. */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

type DeepMerge = ReturnType<typeof deepmergeInit>;
const deepMergeImpl: DeepMerge = deepmergeInit();

const deepMergeEventsImpl: DeepMerge = deepmergeInit({
  // Note: this is not using a recursive deep merge since it isn't used for events.
  mergeArray: () => (a: any[], b: any[]) => stableDedupe([...a, ...b]),
});

// Slightly custom deepMerge which handles `undefined` arguments as empty objects.
export function deepMerge<
  T1 extends object | undefined | null,
  T2 extends object | undefined | null,
>(t1?: T1, t2?: T2): T1 & T2 {
  return deepMergeImpl<T1, T2>(
    t1 ?? ({} as T1),
    t2 ?? ({} as T2)
  ) as unknown as any;
}

// Slightly custom deepMerge which handles `undefined` arguments as empty objects
// and ensures that we remove duplicate event handlers.
export function mergeEvents<
  T1 extends object | undefined,
  T2 extends object | undefined,
>(t1?: T1, t2?: T2): T1 & T2 {
  return deepMergeEventsImpl<T1, T2>(
    t1 ?? ({} as T1),
    t2 ?? ({} as T2)
  ) as unknown as any;
}

/** Dedupes the given array maintaining a stable order in the output array. */
function stableDedupe(input: any[]) {
  const seen = new Set();
  return input.filter((value) => {
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

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
