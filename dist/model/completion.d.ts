import type { SetOptional } from 'type-fest';
import type { ModelArgs } from './model.js';
import type { Model } from './types.js';
import { AbstractModel } from './model.js';
export type CompletionModelArgs = SetOptional<ModelArgs<Model.Completion.Client, Model.Completion.Config, Model.Completion.Run, Model.Completion.Response>, 'client' | 'params'>;
export declare class CompletionModel extends AbstractModel<Model.Completion.Client, Model.Completion.Config, Model.Completion.Run, Model.Completion.Response, Model.Completion.ApiResponse> {
    modelType: "completion";
    modelProvider: "openai";
    constructor(args?: CompletionModelArgs);
    protected runModel(params: Model.Completion.Run & Model.Completion.Config, context: Model.Ctx): Promise<Model.Completion.Response>;
    /** Clone the model and merge/orverride the given properties. */
    clone(args?: CompletionModelArgs): this;
}
