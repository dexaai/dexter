import type { ChatModel } from '../chat/types.js';

export namespace Prompt {
  export type Template<T = Record<string, any>> = (
    params: T
  ) => Promise<ChatModel.Message[]> | ChatModel.Message[];
}
