import dedent from 'dedent';
import { type ChatMessage, type ChatResponse } from 'openai-fetch';
import { type Jsonifiable } from 'type-fest';

import { RefusalError } from '../../model/utils/errors.js';
import { stringifyForModel } from '../functions/stringify-for-model.js';
import { type Prompt } from '../types.js';

type ChatResponseMessage = ChatResponse['choices'][0]['message'];

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

/** Utility class for creating and checking message types. */
export class Msg {
  /** Create a system message. Cleans indentation and newlines by default. */
  static system(
    content: string,
    opts?: {
      /** Custom name for the message. */
      name?: string;
      /** Whether to clean extra newlines and indentation. Defaults to true. */
      cleanContent?: boolean;
    }
  ): Prompt.Msg.System {
    const { name, cleanContent = true } = opts ?? {};
    return {
      role: 'system',
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
  ): Prompt.Msg.User {
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
  ): Prompt.Msg.Assistant {
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
  ): Prompt.Msg.FuncCall {
    return {
      ...opts,
      role: 'assistant',
      content: null,
      function_call,
    };
  }

  /** Create a function result message. */
  static funcResult(content: Jsonifiable, name: string): Prompt.Msg.FuncResult {
    const contentString = stringifyForModel(content);
    return { role: 'function', content: contentString, name };
  }

  /** Create a function call message with argumets. */
  static toolCall(
    tool_calls: Prompt.Msg.Call.Tool[],
    opts?: {
      /** The name descriptor for the message.(message.name) */
      name?: string;
    }
  ): Prompt.Msg.ToolCall {
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
  ): Prompt.Msg.ToolResult {
    const contentString = stringifyForModel(content);
    return { ...opts, role: 'tool', tool_call_id, content: contentString };
  }

  /** Get the narrowed message from an EnrichedResponse. */
  static getMessage(
    // @TODO
    response: any
    // response: ChatModel.EnrichedResponse
  ): Prompt.Msg.Assistant | Prompt.Msg.FuncCall | Prompt.Msg.ToolCall {
    const msg = response.choices[0].message as Prompt.Msg;
    return this.narrowResponseMessage(msg);
  }

  /** Narrow a message received from the API. It only responds with role=assistant */
  static narrowResponseMessage(
    msg: Prompt.Msg
  ): Prompt.Msg.Assistant | Prompt.Msg.FuncCall | Prompt.Msg.ToolCall {
    if (msg.content === null && msg.tool_calls != null) {
      return Msg.toolCall(msg.tool_calls);
    } else if (msg.content === null && msg.function_call != null) {
      return Msg.funcCall(msg.function_call);
    } else if (msg.content != null) {
      return Msg.assistant(msg.content);
    } else {
      // @TODO: probably don't want to error here
      console.log('Invalid message', msg);
      throw new Error('Invalid message');
    }
  }

  /** Check if a message is a system message. */
  static isSystem(
    message: ChatMessage | ChatResponseMessage
  ): message is Prompt.Msg.System {
    return message.role === 'system';
  }
  /** Check if a message is a user message. */
  static isUser(
    message: ChatMessage | ChatResponseMessage
  ): message is Prompt.Msg.User {
    return message.role === 'user';
  }
  /** Check if a message is an assistant message. */
  static isAssistant(
    message: ChatMessage | ChatResponseMessage
  ): message is Prompt.Msg.Assistant {
    return message.role === 'assistant' && message.content != null;
  }
  /** Check if a message is a refusal message. */
  static isRefusal(
    message: ChatMessage | ChatResponseMessage
  ): message is Prompt.Msg.Refusal {
    return message.role === 'assistant' && message.refusal != null;
  }
  /** Check if a message is a function call message with arguments. */
  static isFuncCall(
    message: ChatMessage | ChatResponseMessage
  ): message is Prompt.Msg.FuncCall {
    return message.role === 'assistant' && message.function_call != null;
  }
  /** Check if a message is a function result message. */
  static isFuncResult(
    message: ChatMessage | ChatResponseMessage
  ): message is Prompt.Msg.FuncResult {
    return message.role === 'function' && message.name != null;
  }
  /** Check if a message is a tool calls message. */
  static isToolCall(
    message: ChatMessage | ChatResponseMessage
  ): message is Prompt.Msg.ToolCall {
    return message.role === 'assistant' && message.tool_calls != null;
  }
  /** Check if a message is a tool call result message. */
  static isToolResult(
    message: ChatMessage | ChatResponseMessage
  ): message is Prompt.Msg.ToolResult {
    return message.role === 'tool' && !!message.tool_call_id;
  }

  /**
   * Narrow a ChatModel.Message to a specific type.
   * Throws a RefusalError if the message is a refusal.
   */
  static fromChatMessage(
    message: ChatMessage | ChatResponseMessage
  ):
    | Prompt.Msg.System
    | Prompt.Msg.User
    | Prompt.Msg.Assistant
    | Prompt.Msg.FuncCall
    | Prompt.Msg.FuncResult
    | Prompt.Msg.ToolCall
    | Prompt.Msg.ToolResult {
    if (this.isRefusal(message)) {
      throw new RefusalError(message.refusal);
    }
    delete message.refusal;
    if (this.isSystem(message)) {
      return message;
    }
    if (this.isUser(message)) {
      return message;
    }
    if (this.isAssistant(message)) {
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
