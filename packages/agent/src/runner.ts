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
      params: { model: 'gpt-3.5-turbo-0613' },
    });
  const agent = new LlmChatAgent(model, verbose);
  return new WorkGptRunner({ apis, agent });
}

/** Agent that uses the LLM ChatModel to make requests */
class LlmChatAgent extends ChatAgent {
  private readonly chatModel: ChatModel;

  constructor(chatModel: ChatModel, verbose: boolean = false) {
    super({ verbose });
    if (verbose) {
      chatModel.addHooks({ afterApiResponse: agentLogger });
    }
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

/** Logging function for hooks to debug agents */
function agentLogger(evt: any) {
  const { choices } = evt.response as {
    choices: { message: ChatMessage }[];
  };
  const req = evt.params.messages[evt.params.messages.length - 1];
  const name = req.name ? ` (${req.name})` : '';
  const message = choices[0].message;
  console.log(
    `>> ${req.role}: ${name} ${
      req.content || JSON.stringify(req.function_call || '')
    }`
  );
  console.log(`<< ${message.role}: ${message.content}`, message.function_call);
}
