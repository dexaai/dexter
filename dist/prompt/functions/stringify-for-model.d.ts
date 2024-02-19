import type { Jsonifiable } from 'type-fest';
/**
 * Stringifies a JSON value in a way that's optimized for use with LLM prompts.
 *
 * This is intended to be used with `function` and `tool` arguments and responses.
 */
export declare function stringifyForModel(jsonObject: Jsonifiable | void): string;
