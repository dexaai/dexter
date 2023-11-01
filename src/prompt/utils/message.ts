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
    const { name: msgName } = opts ?? {};
    return {
      role: 'assistant',
      content: null,
      function_call,
      ...(msgName ? { name: msgName } : {}),
    };
  }

  /** Create a function result message. */
  static funcResult(
    content: string | object | unknown[],
    name: string
  ): Prompt.Msg.FuncResult {
    const contentString =
      typeof content === 'string' ? content : JSON.stringify(content);
    return { role: 'function', content: contentString, name };
  }

  /** Get the narrowed message from an EnrichedResponse. */
  static getMessage(
    // @TODO
    response: any
    // response: ChatModel.EnrichedResponse
  ): Prompt.Msg.Assistant | Prompt.Msg.FuncCall {
    const msg = response.choices[0].message as Prompt.Msg;
    return this.narrowResponseMessage(msg);
  }

  /** Narrow a message received from the API. It only responds with role=assistant */
  static narrowResponseMessage(
    msg: Prompt.Msg
  ): Prompt.Msg.Assistant | Prompt.Msg.FuncCall {
    if (msg.content === null && msg.function_call != null) {
      return Msg.funcCall(msg.function_call);
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
  static isFuncCall(message: Prompt.Msg): message is Prompt.Msg.FuncCall {
    return message.role === 'assistant' && message.function_call != null;
  }
  /** Check if a message is a function result message. */
  static isFuncResult(message: Prompt.Msg): message is Prompt.Msg.FuncResult {
    return message.role === 'function' && message.name != null;
  }

  /** Narrow a ChatModel.Message to a specific type. */
  static narrow(message: Prompt.Msg.System): Prompt.Msg.System;
  static narrow(message: Prompt.Msg.User): Prompt.Msg.User;
  static narrow(message: Prompt.Msg.Assistant): Prompt.Msg.Assistant;
  static narrow(message: Prompt.Msg.FuncCall): Prompt.Msg.FuncCall;
  static narrow(message: Prompt.Msg.FuncResult): Prompt.Msg.FuncResult;
  static narrow(
    message: Prompt.Msg
  ):
    | Prompt.Msg.System
    | Prompt.Msg.User
    | Prompt.Msg.Assistant
    | Prompt.Msg.FuncCall
    | Prompt.Msg.FuncResult {
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
    throw new Error('Invalid message type');
  }
}
