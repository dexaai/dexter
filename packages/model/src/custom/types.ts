import type { Model } from '../types2.js';

/**
 * Sparse vector model (SPLADE)
 */
export namespace SparseVector {
  /** Sparse vector from SPLADE models. */
  export type Vector = {
    indices: number[];
    values: number[];
  };
  export interface Run extends Model.Run {
    input: string[];
  }
  export interface Config extends Model.Config {
    concurrency?: number;
    throttleLimit?: number;
    throttleInterval?: number;
  }
  export interface Response extends Model.Response {
    vectors: Vector[];
  }
  export interface IModel<
    SConfig extends Config = Config,
    SRun extends Run = Run,
    SResponse extends Response = Response
  > extends Model.IModel<SConfig, SRun, SResponse> {
    modelType: 'sparse-vector';
  }
}
