import type { SetOptional } from 'type-fest';
import type { ModelArgs } from './model.js';
import type { Model } from './types.js';
import { AbstractModel } from './model.js';
export type ChatModelArgs = SetOptional<ModelArgs<Model.Chat.Client, Model.Chat.Config, Model.Chat.Run, Model.Chat.Response>, 'client' | 'params'>;
export declare class ChatModel extends AbstractModel<Model.Chat.Client, Model.Chat.Config, Model.Chat.Run, Model.Chat.Response, Model.Chat.ApiResponse> {
    modelType: "chat";
    modelProvider: "openai";
    constructor(args?: ChatModelArgs);
    protected runModel({ handleUpdate, ...params }: Model.Chat.Run & Model.Chat.Config, context: Model.Ctx): Promise<Model.Chat.Response>;
    /** Clone the model and merge/orverride the given properties. */
    clone(args?: ChatModelArgs): this;
}
