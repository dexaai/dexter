import { WorkGptRunner } from 'workgpt/runners/workgpt';
import type { Api } from 'workgpt/apis/base';
import { ChatModel } from '@dexaai/model/openai';
import { ChatAgent } from 'workgpt/chat-agents/base';
import type { ChatRequest, ChatResponse } from 'workgpt/chat-agents/types';
import type { ChatMessage } from '@dexaai/model';

/** Create a WorkGptRunner using an LLM ChatModel. */
export function createRunner(
  apis: Api[],
  chatModel?: ChatModel,
  verbose: boolean = false
): WorkGptRunner {
  const model =
    chatModel ??
    new ChatModel({
      debug: verbose,
      params: { model: 'gpt-3.5-turbo-0613' },
    });
  const agent = new LlmChatAgent(model);
  return new WorkGptRunner({ apis, agent });
}

/** Agent that uses the LLM ChatModel to make requests */
class LlmChatAgent extends ChatAgent {
  private readonly chatModel: ChatModel;

  constructor(chatModel: ChatModel) {
    super();
    this.chatModel = chatModel;
  }

  async call(args: ChatRequest): Promise<ChatResponse> {
    const { message } = await this.chatModel.run({
      messages: args.messages as ChatMessage[],
      functions: args.functions,
    });
    return message as ChatResponse;
  }
}
