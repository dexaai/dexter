import 'reflect-metadata';
import type { z } from 'zod';
import { FunctionSet } from './function-set.js';
import { ToolSet } from './tool-set.js';
import { zodToJsonSchema } from '../prompt/functions/zod-to-json.js';
import type { Prompt } from '../prompt/index.js';

export const invocableMetadataKey = Symbol('invocable');

export interface Invocable {
  name: string;
  description?: string;
  schema?: z.AnyZodObject;
  callback: (args: Record<string, any>) => Promise<any>;
}

export abstract class AIToolsProvider {
  private _tools?: ToolSet;
  private _functions?: FunctionSet;

  get namespace() {
    return this.constructor.name;
  }

  get tools(): ToolSet {
    if (!this._tools) {
      this._tools = ToolSet.fromFunctionSet(this.functions);
    }

    return this._tools;
  }

  get functions(): FunctionSet {
    if (!this._functions) {
      const invocables = getInvocables(this);
      const functions = invocables.map(getFunctionSpec);
      this._functions = new FunctionSet(functions);
    }

    return this._functions;
  }
}

export function getFunctionSpec(invocable: Invocable): Prompt.AIFunctionSpec {
  const { name, description, schema } = invocable;

  return {
    name,
    description,
    parameters: schema
      ? zodToJsonSchema(schema)
      : {
          type: 'object',
          properties: {},
        },
  };
}

/**
 * Constraints:
 *   - params must be an object, so the underlying function should only expect a
 *     single parameter
 *   - for the return value type `T | MaybePromise<T>`, `T` must be serializable
 *     to JSON
 */
export function aiFunction({
  name,
  description,
  schema,
}: {
  name?: string;
  description?: string;

  // params must be an object, so the underlying function should only expect a
  // single parameter
  schema?: z.AnyZodObject;
}) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const existingInvocables = getPrivateInvocables(target);

    existingInvocables.push({
      propertyKey,
      description,
      name,
      schema,
    });

    setPrivateInvocables(target, existingInvocables);

    return descriptor.get ?? descriptor.value;
  };
}

export function getInvocables(target: object): Invocable[] {
  const invocables = getPrivateInvocables(target);
  const namespace = target.constructor.name;

  return invocables.map((invocable) => ({
    ...invocable,
    name: invocable.name ?? `${namespace}_${invocable.propertyKey}`,
    callback: (target as any)[invocable.propertyKey].bind(target),
  }));
}

interface PrivateInvocable {
  propertyKey: string;
  name?: string;
  description?: string;
  schema?: z.AnyZodObject;
}

function getPrivateInvocables(target: object): PrivateInvocable[] {
  return Reflect.getMetadata(invocableMetadataKey, target) ?? [];
}

function setPrivateInvocables(target: object, invocables: PrivateInvocable[]) {
  Reflect.defineMetadata(invocableMetadataKey, invocables, target);
}
