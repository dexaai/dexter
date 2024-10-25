import pMap from 'p-map';

import { ChatModel, createOpenAIClient, type Msg, MsgUtil } from '../index.js';
import { type Model } from '../model/types.js';
import { getErrorMsg } from '../model/utils/errors.js';
import {
  type Agent,
  type CtxVal,
  type SwarmFunc,
  type SwarmFuncResult,
  type SwarmResponse,
} from './types.js';

export class Swarm {
  chatModel: ChatModel<Model.Ctx, Model.Chat.Client, Model.Chat.Config<Model.Chat.Client>>;
  defaultModel: Model.Base.AvailableModels<Model.Chat.Client>;

  constructor(
    args?: {
      chatModel?: ChatModel<Model.Ctx, Model.Chat.Client, Model.Chat.Config<Model.Chat.Client>>;
    }
  ) {
    this.chatModel =
      args?.chatModel ||
      new ChatModel({
        client: createOpenAIClient(),
        params: { model: 'gpt-4o' },
      });
    this.defaultModel = this.chatModel.params.model
  }

  async run(args: {
    agent: Agent;
    messages: Msg[];
    ctx?: CtxVal;
    modelOverride?: string;
    maxTurns?: number;
  }): Promise<SwarmResponse> {
    const { agent, messages, modelOverride, maxTurns = Infinity } = args;

    let activeAgent: Agent = agent;
    const ctx: CtxVal = { ...args.ctx };
    const history: Msg[] = [...messages];
    const initLen = messages.length;

    while (history.length - initLen < maxTurns && activeAgent) {
      // HOOK: beforeGetChatCompletion(??) => Promise<???>
      // - Use this to manage conversation history length

      // Get completion with current history, agent
      const message = await this.getChatCompletion({
        agent: activeAgent,
        history,
        ctx,
        modelOverride,
      });

      history.push({ ...message });

      // HOOK: afterGetChatCompletion(??) => Promise<???>
      // - Use this to post-process the message from the model

      // HOOK: shouldEndTurn(??) => Promise<boolean>
      // - Use this to end the conversation early (eg: tool to halt loop)

      if (!MsgUtil.isToolCall(message)) {
        break;
      }

      // Handle function calls, updating context_variables, and switching agents
      const partialResponse = await this.handleToolCalls({
        message,
        functions: activeAgent.functions || [],
        functionCallConcurrency: 1,
        ctx,
      });

      history.push(...partialResponse.messages);
      Object.assign(ctx, partialResponse.ctx);

      if (partialResponse.agent) {
        activeAgent = partialResponse.agent;
      }
    }

    return {
      messages: history.slice(initLen),
      agent: activeAgent,
      ctx,
    };
  }

  private async getChatCompletion(args: {
    agent: Agent;
    history: Msg[];
    ctx: CtxVal;
    modelOverride?: string;
  }): Promise<Msg.Assistant | Msg.ToolCall> {
    const { agent, history, modelOverride } = args;
    const ctx: CtxVal = { ...args.ctx };
    const instructions =
      typeof agent.instructions === 'function'
        ? agent.instructions(ctx)
        : agent.instructions;
    const messages: Msg[] = [
      { role: 'system', content: instructions },
      ...history,
    ];

    const tools = agent.functions.map((func) => ({
      function: func.spec,
      type: 'function' as const,
    }));

    const response = await this.chatModel.run({
      messages,
      model: modelOverride || agent.model || this.defaultModel,
      tools: tools.length > 0 ? tools : undefined,
      // handleUpdate: (c) => console.log('ChatModel.run update:', c),
    });

    if (MsgUtil.isToolCall(response.message)) {
      return response.message;
    } else if (MsgUtil.isAssistant(response.message)) {
      return { ...response.message, name: agent.name };
    } else {
      // TODO: not sure when this would happen so log and cast for now...
      console.error('Unexpected message type:', response.message);
      return response.message as unknown as Msg.Assistant;
    }
  }

  /**
   * Handle messages that require calling functions.
   * @returns An array of the new messages from the function calls
   * Note: Does not include args.message in the returned array
   */
  private async handleToolCalls(args: {
    message: Msg;
    functions?: SwarmFunc[];
    functionCallConcurrency?: number;
    ctx: CtxVal;
  }): Promise<{
    messages: Msg[];
    agent?: Agent;
    ctx: CtxVal;
  }> {
    const { ctx, message, functions = [], functionCallConcurrency = 8 } = args;
    const messages: Msg[] = [message];
    const funcMap = this.getFuncMap(functions);
    let agent: Agent | undefined;

    // Run all the tool_calls functions and add the result messages.
    if (MsgUtil.isToolCall(message)) {
      await pMap(
        message.tool_calls,
        async (toolCall) => {
          const result = await this.callFunction({
            ...toolCall.function,
            funcMap,
          });
          messages.push(MsgUtil.toolResult(result.value, toolCall.id));
          if (result.agent) {
            agent = result.agent;
          }
        },
        { concurrency: functionCallConcurrency }
      );
    }

    return {
      messages: messages.slice(1),
      agent,
      ctx,
    };
  }

  /** Call a function and return the result. */
  private async callFunction(args: {
    name: string;
    arguments: string;
    funcMap: Map<string, SwarmFunc>;
  }): Promise<SwarmFuncResult> {
    const { arguments: funcArgs, name, funcMap } = args;

    const func = funcMap.get(name);
    if (!func) {
      console.error(`Tool ${name} not found in function map.`);
      return { value: `Error: Tool ${name} not found.` };
    }

    try {
      return await func(funcArgs);
    } catch (err) {
      const errMsg = getErrorMsg(err);
      console.error(`Error running function ${name}:`, err);
      return { value: `Error running function ${name}: ${errMsg}` };
    }
  }

  /** Create a map of function names to functions for easy lookup. */
  private getFuncMap(functions: SwarmFunc[]): Map<string, SwarmFunc> {
    return functions.reduce((map, func) => {
      map.set(func.spec.name, func);
      return map;
    }, new Map<string, SwarmFunc>());
  }
}
