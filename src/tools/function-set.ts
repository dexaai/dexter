import type { Prompt } from '../prompt/index.js';
import type { ToolSet } from './tool-set.js';

export class FunctionSet implements Iterable<Prompt.AIFunctionSpec> {
  protected _map: Map<string, Prompt.AIFunctionSpec>;

  constructor(functions?: readonly Prompt.AIFunctionSpec[] | null) {
    this._map = new Map(
      functions ? functions.map((fn) => [fn.name, fn]) : null
    );
  }

  get size(): number {
    return this._map.size;
  }

  add(fn: Prompt.AIFunctionSpec): this {
    this._map.set(fn.name, fn);
    return this;
  }

  get(name: string): Prompt.AIFunctionSpec | undefined {
    return this._map.get(name);
  }

  set(name: string, fn: Prompt.AIFunctionSpec): this {
    this._map.set(name, fn);
    return this;
  }

  has(name: string): boolean {
    return this._map.has(name);
  }

  clear(): void {
    this._map.clear();
  }

  delete(name: string): boolean {
    return this._map.delete(name);
  }

  pick(...keys: string[]): FunctionSet {
    const keysToIncludeSet = new Set(keys);
    return new FunctionSet(
      Array.from(this).filter((fn) => keysToIncludeSet.has(fn.name))
    );
  }

  omit(...keys: string[]): FunctionSet {
    const keysToExcludeSet = new Set(keys);
    return new FunctionSet(
      Array.from(this).filter((fn) => !keysToExcludeSet.has(fn.name))
    );
  }

  get entries(): IterableIterator<Prompt.AIFunctionSpec> {
    return this._map.values();
  }

  [Symbol.iterator](): Iterator<Prompt.AIFunctionSpec> {
    return this.entries;
  }

  static fromToolSet(toolSet: ToolSet): FunctionSet {
    return new FunctionSet(
      Array.from(toolSet)
        .filter((tool) => tool.type === 'function')
        .map((tool) => tool.function)
    );
  }
}
