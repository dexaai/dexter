import type { ModelArgs } from './model.js';
import { AbstractModel } from './model.js';
import type { Model } from './types.js';
import type { Prettify } from '../utils/helpers.js';
export type SparseVectorModelArgs = Prettify<Omit<ModelArgs<Model.SparseVector.Client, Model.SparseVector.Config, Model.SparseVector.Run, Model.SparseVector.Response>, 'client'> & {
    serviceUrl?: string;
}>;
export declare class SparseVectorModel extends AbstractModel<Model.SparseVector.Client, Model.SparseVector.Config, Model.SparseVector.Run, Model.SparseVector.Response> {
    modelType: "sparse-vector";
    modelProvider: "custom";
    serviceUrl: string;
    constructor(args: SparseVectorModelArgs);
    protected runModel(params: Model.SparseVector.Run & Model.SparseVector.Config, context: Model.Ctx): Promise<Model.SparseVector.Response>;
    protected runSingle(params: {
        input: string;
        model: string;
    }, context: Model.Ctx): Promise<{
        vector: Model.SparseVector.Vector;
        tokens: {
            readonly prompt: 0;
            readonly completion: 0;
            readonly total: 0;
        };
    }>;
    /** Clone the model and merge/orverride the given properties. */
    clone(args?: SparseVectorModelArgs): this;
}
