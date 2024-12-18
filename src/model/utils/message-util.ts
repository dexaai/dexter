import dedent from 'dedent';
import { type ChatMessage, type ChatResponse } from 'openai-fetch';
import { type Jsonifiable } from 'type-fest';

import { type Msg } from '../types.js';
import { RefusalError } from './errors.js';

type ChatResponseMessage = ChatResponse['choices'][0]['message'];

/** Utility class for creating and checking message types. */
export class MsgUtil {
  /** Create a system message. Cleans indentation and newlines by default. */
  static system(
    content: string,
    opts?: {
      /** Custom name for the message. */
      name?: string;
      /** Whether to clean extra newlines and indentation. Defaults to true. */
      cleanContent?: boolean;
    }
  ): Msg.System {
    const { name, cleanContent = true } = opts ?? {};
    return {
      role: 'system',
      content: cleanContent ? cleanString(content) : content,
      ...(name ? { name } : {}),
    };
  }

  /** Create a developer message. Cleans indentation and newlines by default. */
  static developer(
    content: string,
    opts?: {
      /** Custom name for the message. */
      name?: string;
      /** Whether to clean extra newlines and indentation. Defaults to true. */
      cleanContent?: boolean;
    }
  ): Msg.Developer {
    const { name, cleanContent = true } = opts ?? {};
    return {
      role: 'developer',
      content: cleanContent ? cleanString(content) : content,
      ...(name ? { name } : {}),
    };
  }

  /** Create a user message. Cleans indentation and newlines by default. */
  static user(
    content: string,
    opts?: {
      /** Custom name for the message. */
      name?: string;
      /** Whether to clean extra newlines and indentation. Defaults to true. */
      cleanContent?: boolean;
    }
  ): Msg.User {
    const { name, cleanContent = true } = opts ?? {};
    return {
      role: 'user',
      content: cleanContent ? cleanString(content) : content,
      ...(name ? { name } : {}),
    };
  }

  /** Create an assistant message. Cleans indentation and newlines by default. */
  static assistant(
    content: string,
    opts?: {
      /** Custom name for the message. */
      name?: string;
      /** Whether to clean extra newlines and indentation. Defaults to true. */
      cleanContent?: boolean;
    }
  ): Msg.Assistant {
    const { name, cleanContent = true } = opts ?? {};
    return {
      role: 'assistant',
      content: cleanContent ? cleanString(content) : content,
      ...(name ? { name } : {}),
    };
  }

  /** Create a function call message with argumets. */
  static funcCall(
    function_call: {
      /** Name of the function to call. */
      name: string;
      /** Arguments to pass to the function. */
      arguments: string;
    },
    opts?: {
      /** The name descriptor for the message.(message.name) */
      name?: string;
    }
  ): Msg.FuncCall {
    return {
      ...opts,
      role: 'assistant',
      content: null,
      function_call,
    };
  }

  /** Create a function result message. */
  static funcResult(content: Jsonifiable, name: string): Msg.FuncResult {
    const contentString = stringifyForModel(content);
    return { role: 'function', content: contentString, name };
  }

  /** Create a function call message with argumets. */
  static toolCall(
    tool_calls: Msg.Call.Tool[],
    opts?: {
      /** The name descriptor for the message.(message.name) */
      name?: string;
    }
  ): Msg.ToolCall {
    return {
      ...opts,
      role: 'assistant',
      content: null,
      tool_calls,
    };
  }

  /** Create a tool call result message. */
  static toolResult(
    content: Jsonifiable,
    tool_call_id: string,
    opts?: {
      /** The name of the tool which was called */
      name?: string;
    }
  ): Msg.ToolResult {
    const contentString = stringifyForModel(content);
    return { ...opts, role: 'tool', tool_call_id, content: contentString };
  }

  /** Check if a message is a system message. */
  static isSystem(
    message: ChatMessage | ChatResponseMessage | Msg
  ): message is Msg.System {
    return message.role === 'system';
  }

  /** Check if a message is a developer message. */
  static isDeveloper(
    message: ChatMessage | ChatResponseMessage | Msg
  ): message is Msg.Developer {
    return message.role === 'developer';
  }

  /** Throw a RefusalError if a message is a refusal. */
  private static throwIfRefusal(
    message: ChatMessage | ChatResponseMessage | Msg
  ) {
    if (this.isRefusal(message)) {
      throw new RefusalError(message.refusal);
    }
  }

  /** Assert that a message is a system message. */
  static assertSystem(
    message: ChatMessage | ChatResponseMessage | Msg
  ): asserts message is Msg.System {
    this.throwIfRefusal(message);
    if (!this.isSystem(message)) {
      throw new Error('Expected system message');
    }
  }

  /** Check if a message is a user message. */
  static isUser(
    message: ChatMessage | ChatResponseMessage | Msg
  ): message is Msg.User {
    return message.role === 'user';
  }

  /** Assert that a message is a user message. */
  static assertUser(
    message: ChatMessage | ChatResponseMessage | Msg
  ): asserts message is Msg.User {
    this.throwIfRefusal(message);
    if (!this.isUser(message)) {
      throw new Error('Expected user message');
    }
  }

  /** Check if a message is an assistant message. */
  static isAssistant(
    message: ChatMessage | ChatResponseMessage | Msg
  ): message is Msg.Assistant {
    return message.role === 'assistant' && message.content != null;
  }

  /** Assert that a message is an assistant message. */
  static assertAssistant(
    message: ChatMessage | ChatResponseMessage | Msg
  ): asserts message is Msg.Assistant {
    this.throwIfRefusal(message);
    if (!this.isAssistant(message)) {
      throw new Error('Expected assistant message');
    }
  }

  /** Check if a message is a refusal message. */
  static isRefusal(
    // TODO: add back `| Msg`
    message: ChatMessage | ChatResponseMessage
  ): message is Msg.Refusal {
    return message.role === 'assistant' && message.refusal != null;
  }

  /** Assert that a message is a refusal message. */
  static assertRefusal(
    message: ChatMessage | ChatResponseMessage | Msg
  ): asserts message is Msg.Refusal {
    if (!this.isRefusal(message)) {
      throw new Error('Expected refusal message');
    }
  }

  /** Check if a message is a function call message with arguments. */
  static isFuncCall(
    message: ChatMessage | ChatResponseMessage | Msg
  ): message is Msg.FuncCall {
    return (
      message.role === 'assistant' &&
      'function_call' in message &&
      message.function_call != null
    );
  }

  /** Assert that a message is a function call message with arguments. */
  static assertFuncCall(
    message: ChatMessage | ChatResponseMessage | Msg
  ): asserts message is Msg.FuncCall {
    this.throwIfRefusal(message);
    if (!this.isFuncCall(message)) {
      throw new Error('Expected function call message');
    }
  }

  /** Check if a message is a function result message. */
  static isFuncResult(
    message: ChatMessage | ChatResponseMessage | Msg
  ): message is Msg.FuncResult {
    return message.role === 'function' && message.name != null;
  }

  /** Assert that a message is a function result message. */
  static assertFuncResult(
    message: ChatMessage | ChatResponseMessage | Msg
  ): asserts message is Msg.FuncResult {
    this.throwIfRefusal(message);
    if (!this.isFuncResult(message)) {
      throw new Error('Expected function result message');
    }
  }

  /** Check if a message is a tool calls message. */
  static isToolCall(
    message: ChatMessage | ChatResponseMessage | Msg
  ): message is Msg.ToolCall {
    return (
      message.role === 'assistant' &&
      'tool_calls' in message &&
      message.tool_calls != null
    );
  }

  /** Assert that a message is a tool calls message. */
  static assertToolCall(
    message: ChatMessage | ChatResponseMessage | Msg
  ): asserts message is Msg.ToolCall {
    this.throwIfRefusal(message);
    if (!this.isToolCall(message)) {
      throw new Error('Expected tool call message');
    }
  }

  /** Check if a message is a tool call result message. */
  static isToolResult(
    message: ChatMessage | ChatResponseMessage | Msg
  ): message is Msg.ToolResult {
    return message.role === 'tool' && !!message.tool_call_id;
  }

  /** Assert that a message is a tool call result message. */
  static assertToolResult(
    message: ChatMessage | ChatResponseMessage | Msg
  ): asserts message is Msg.ToolResult {
    this.throwIfRefusal(message);
    if (!this.isToolResult(message)) {
      throw new Error('Expected tool result message');
    }
  }

  /**
   * Narrow a ChatModel.Message to a specific type.
   */
  static fromChatMessage(
    message: ChatMessage | ChatResponseMessage
  ):
    | Msg.System
    | Msg.User
    | Msg.Assistant
    | Msg.Refusal
    | Msg.FuncCall
    | Msg.FuncResult
    | Msg.ToolCall
    | Msg.ToolResult {
    if (this.isSystem(message)) {
      return message;
    }
    if (this.isUser(message)) {
      return message;
    }
    if (this.isAssistant(message)) {
      return message;
    }
    if (this.isRefusal(message)) {
      return message;
    }
    if (this.isFuncCall(message)) {
      return message;
    }
    if (this.isFuncResult(message)) {
      return message;
    }
    if (this.isToolCall(message)) {
      return message;
    }
    if (this.isToolResult(message)) {
      return message;
    }
    throw new Error('Invalid message type');
  }
}

/**
 * Clean a string by removing extra newlines and indentation.
 * @see: https://github.com/dmnd/dedent
 */
export function cleanString(text: string): string {
  // TODO: Should this trim the output as well? could be useful for multiline
  // templated strings which begin or end with unnecessary newlines.
  const dedenter = dedent.withOptions({ escapeSpecialCharacters: true });
  return dedenter(text);
}

/**
 * Stringifies a JSON value in a way that's optimized for use with LLM prompts.
 *
 * This is intended to be used with `function` and `tool` arguments and responses.
 */
function stringifyForModel(jsonObject: Jsonifiable | void): string {
  if (jsonObject === undefined) {
    return '';
  }

  if (typeof jsonObject === 'string') {
    return jsonObject;
  }

  return JSON.stringify(jsonObject, null, 0);
}
