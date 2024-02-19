import type { SetOptional } from 'type-fest';
import type { ModelArgs } from './model.js';
import type { Model } from './types.js';
import { AbstractModel } from './model.js';
export type EmbeddingModelArgs = SetOptional<ModelArgs<Model.Embedding.Client, Model.Embedding.Config, Model.Embedding.Run, Model.Embedding.Response>, 'client' | 'params'>;
type BulkEmbedder = (params: Model.Embedding.Run & Model.Embedding.Config, context: Model.Ctx) => Promise<Model.Embedding.Response>;
export declare class EmbeddingModel extends AbstractModel<Model.Embedding.Client, Model.Embedding.Config, Model.Embedding.Run, Model.Embedding.Response, Model.Embedding.ApiResponse> {
    modelType: "embedding";
    modelProvider: "openai";
    throttledModel: BulkEmbedder;
    /** Doesn't accept OpenAIClient because retry needs to be handled at the model level. */
    constructor(args?: EmbeddingModelArgs);
    protected runModel(params: Model.Embedding.Run & Model.Embedding.Config, context: Model.Ctx): Promise<Model.Embedding.Response>;
    /** Clone the model and merge/orverride the given properties. */
    clone(args?: EmbeddingModelArgs): this;
}
export {};
