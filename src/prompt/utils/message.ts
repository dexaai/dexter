import dedent from 'dedent';
import type { Prompt } from '../types.js';

/**
 * Clean a string by removing extra newlines and indentation.
 * @see: https://github.com/dmnd/dedent
 */
export function cleanString(text: string): string {
  const dedenter = dedent.withOptions({ escapeSpecialCharacters: true });
  return dedenter(text);
}

/** Utility class for creating and checking message types. */
export class Msg {
  /** Create a system message. Cleans indentation and newlines by default. */
  static system(
    content: string,
    opts?: {
      /** Whether to clean extra newlines and indentation. Defaults to true. */
      cleanContent?: boolean;
    }
  ): Prompt.Msg.System {
    const { cleanContent = true } = opts ?? {};
    return {
      role: 'system',
      content: cleanContent ? cleanString(content) : content,
    };
  }

  /** Create a user message. Cleans indentation and newlines by default. */
  static user(
    content: string,
    opts?: {
      /** Whether to clean extra newlines and indentation. Defaults to true. */
      cleanContent?: boolean;
    }
  ): Prompt.Msg.User {
    const { cleanContent = true } = opts ?? {};
    return {
      role: 'user',
      content: cleanContent ? cleanString(content) : content,
    };
  }

  /** Create an assistant message. Cleans indentation and newlines by default. */
  static assistant(
    content: string,
    opts?: {
      /** Whether to clean extra newlines and indentation. Defaults to true. */
      cleanContent?: boolean;
    }
  ): Prompt.Msg.Assistant {
    const { cleanContent = true } = opts ?? {};
    return {
      role: 'assistant',
      content: cleanContent ? cleanString(content) : content,
    };
  }

  /** Create a function call message with argumets. */
  static assistantFunctionCall(function_call: {
    /** Name of the function to call. */
    name: string;
    /** Arguments to pass to the function. */
    arguments: string;
  }): Prompt.Msg.AssistantFunctionCall {
    return {
      role: 'assistant',
      content: null,
      function_call,
    };
  }

  /** Create a function result message. */
  static functionResult(
    content: string | object | unknown[],
    name: string
  ): Prompt.Msg.FunctionResult {
    const contentString =
      typeof content === 'string' ? content : JSON.stringify(content);
    return { role: 'function', content: contentString, name };
  }

  /** Create a function call message with argumets. */
  static assistantToolCalls(
    tool_calls: Prompt.Msg.ToolCall[]
  ): Prompt.Msg.AssistantToolCalls {
    return {
      role: 'assistant',
      content: null,
      tool_calls,
    };
  }

  /** Create a tool call result message. */
  static toolCallResult(
    content: string | object | unknown[],
    tool_call_id: string
  ): Prompt.Msg.ToolCallResult {
    const contentString =
      typeof content === 'string' ? content : JSON.stringify(content);
    return { role: 'tool', tool_call_id, content: contentString };
  }

  /** Get the narrowed message from an EnrichedResponse. */
  static getMessage(
    // @TODO
    response: any
    // response: ChatModel.EnrichedResponse
  ):
    | Prompt.Msg.Assistant
    | Prompt.Msg.AssistantFunctionCall
    | Prompt.Msg.AssistantToolCalls {
    const msg = response.choices[0].message as Prompt.Msg;
    return this.narrowResponseMessage(msg);
  }

  /** Narrow a message received from the API. It only responds with role=assistant */
  static narrowResponseMessage(
    msg: Prompt.Msg
  ):
    | Prompt.Msg.Assistant
    | Prompt.Msg.AssistantFunctionCall
    | Prompt.Msg.AssistantToolCalls {
    if (msg.content === null && msg.tool_calls != null) {
      return Msg.assistantToolCalls(msg.tool_calls);
    } else if (msg.content === null && msg.function_call != null) {
      return Msg.assistantFunctionCall(msg.function_call);
    } else if (msg.content !== null) {
      return Msg.assistant(msg.content);
    } else {
      // @TODO: probably don't want to error here
      console.log('Invalid message', msg);
      throw new Error('Invalid message');
    }
  }

  /** Check if a message is a system message. */
  static isSystem(message: Prompt.Msg): message is Prompt.Msg.System {
    return message.role === 'system';
  }
  /** Check if a message is a user message. */
  static isUser(message: Prompt.Msg): message is Prompt.Msg.User {
    return message.role === 'user';
  }
  /** Check if a message is an assistant message. */
  static isAssistant(message: Prompt.Msg): message is Prompt.Msg.Assistant {
    return message.role === 'assistant' && message.content !== null;
  }
  /** Check if a message is a function call message with arguments. */
  static isAssistantFunctionCall(
    message: Prompt.Msg
  ): message is Prompt.Msg.AssistantFunctionCall {
    return message.role === 'assistant' && message.function_call != null;
  }
  /** Check if a message is a function result message. */
  static isFunctionResult(
    message: Prompt.Msg
  ): message is Prompt.Msg.FunctionResult {
    return message.role === 'function' && message.name != null;
  }
  /** Check if a message is a tool calls message. */
  static isAssistantToolCalls(
    message: Prompt.Msg
  ): message is Prompt.Msg.AssistantToolCalls {
    return message.role === 'assistant' && message.tool_calls != null;
  }
  /** Check if a message is a tool call result message. */
  static isToolCallResult(
    message: Prompt.Msg
  ): message is Prompt.Msg.ToolCallResult {
    return message.role === 'tool' && !!message.tool_call_id;
  }

  /** Narrow a ChatModel.Message to a specific type. */
  static narrow(message: Prompt.Msg.System): Prompt.Msg.System;
  static narrow(message: Prompt.Msg.User): Prompt.Msg.User;
  static narrow(message: Prompt.Msg.Assistant): Prompt.Msg.Assistant;
  static narrow(
    message: Prompt.Msg.AssistantFunctionCall
  ): Prompt.Msg.AssistantFunctionCall;
  static narrow(message: Prompt.Msg.FunctionResult): Prompt.Msg.FunctionResult;
  static narrow(
    message: Prompt.Msg.AssistantToolCalls
  ): Prompt.Msg.AssistantToolCalls;
  static narrow(message: Prompt.Msg.ToolCallResult): Prompt.Msg.ToolCallResult;
  static narrow(
    message: Prompt.Msg
  ):
    | Prompt.Msg.System
    | Prompt.Msg.User
    | Prompt.Msg.Assistant
    | Prompt.Msg.AssistantFunctionCall
    | Prompt.Msg.FunctionResult
    | Prompt.Msg.AssistantToolCalls
    | Prompt.Msg.ToolCallResult {
    if (this.isSystem(message)) {
      return message;
    }
    if (this.isUser(message)) {
      return message;
    }
    if (this.isAssistant(message)) {
      return message;
    }
    if (this.isAssistantFunctionCall(message)) {
      return message;
    }
    if (this.isFunctionResult(message)) {
      return message;
    }
    if (this.isAssistantToolCalls(message)) {
      return message;
    }
    if (this.isToolCallResult(message)) {
      return message;
    }
    throw new Error('Invalid message type');
  }
}
