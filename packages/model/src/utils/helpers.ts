import { deepmerge as deepmergeInit } from '@fastify/deepmerge';

/** Improve preview of union types in autocomplete. */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

type DeepMerge = ReturnType<typeof deepmergeInit>;
export const deepMerge: DeepMerge = deepmergeInit();
