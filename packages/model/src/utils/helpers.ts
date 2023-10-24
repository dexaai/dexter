import { deepmerge as deepmergeInit } from '@fastify/deepmerge';

type DeepMerge = ReturnType<typeof deepmergeInit>;
export const deepMerge: DeepMerge = deepmergeInit();
