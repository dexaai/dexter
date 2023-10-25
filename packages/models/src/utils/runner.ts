import type { ChatMessage } from 'openai-fetch';
import type { ChatModel } from '../chat/types.js';
import type { AiFunction } from './ai-function.js';

type RunnerOptions = {
  chatModel: ChatModel;
  functions: AiFunction[];
  maxIterations?: number;
};
type ChatRequest = {
  messages: ChatMessage[];
  functions?: AiFunction[];
};

export class RunnerHalt extends Error {
  result: any;
  constructor(result: any) {
    super('RunnerHalt');
    this.result = result;
  }
}

export function haltRunner(result: any): never {
  throw new RunnerHalt(result);
}

export class Runner {
  private chatModel: ChatModel;
  private functions: AiFunction[];
  private messages: ChatMessage[] = [];
  private maxIterations: number = 5;
  private iteration: number = 0;

  constructor({ chatModel, functions, maxIterations }: RunnerOptions) {
    this.chatModel = chatModel;
    this.functions = functions;
    this.maxIterations = maxIterations ?? this.maxIterations;
  }

  private async call(message: ChatMessage): Promise<ChatMessage> {
    if (message.function_call) {
      return this.onFunctionCall(message.function_call);
    }
    haltRunner(message.content);
  }

  private async onFunctionCall(
    functionCall: NonNullable<ChatMessage['function_call']>
  ): Promise<ChatMessage> {
    const func = this.functions.find(
      (inv) => inv.spec.name === functionCall.name
    );

    if (!func) {
      throw new Error(`Unknown function: ${functionCall.name}`);
    }

    const result = await func(functionCall.arguments);
    const content =
      typeof result === 'string' ? result : JSON.stringify(result);

    return {
      role: 'function',
      name: functionCall.name,
      content,
    };
  }

  private reset({ messages, functions }: ChatRequest) {
    this.messages = messages;
    this.functions = functions ?? [];
    this.iteration = 0;
  }

  async run(request: ChatRequest): Promise<ChatMessage[]> {
    this.reset(request);

    // eslint-disable-next-line no-constant-condition
    while (this.iteration < this.maxIterations) {
      this.iteration += 1;
      const assistantMessage = await this.chatModel.generate({
        messages: this.messages,
        functions: this.functions.map((func) => func.spec),
      });

      try {
        const userMessage = await this.call(assistantMessage);
        this.messages = [...this.messages, assistantMessage, userMessage];
      } catch (error: any) {
        if (error instanceof RunnerHalt) {
          this.messages = [
            ...this.messages,
            assistantMessage,
            { role: 'assistant', content: error.result },
          ];
          return this.messages;
        } else {
          throw error;
        }
      }
    }

    // Getting here means we hit the max iterations. Run one last time without
    // the functions to get the final message.
    const { message: finalMessage } = await this.chatModel.run({
      messages: this.messages,
      functions: undefined,
    });
    this.messages = [...this.messages, finalMessage];
    return this.messages;
  }
}
