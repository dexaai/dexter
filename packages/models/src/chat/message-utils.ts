import type { ChatModel } from './types.js';

/** Narrowed ChatModel.Message types. */
export namespace Msg {
  /** Message with text content for the system. */
  export type System = {
    role: 'system';
    name?: string;
    content: string;
  };
  /** Message with text content from the user. */
  export type User = {
    role: 'user';
    name?: string;
    content: string;
  };
  /** Message with text content from the assistant. */
  export type Assistant = {
    role: 'assistant';
    name?: string;
    content: string;
  };
  /** Message with arguments to call a function. */
  export type FuncCall = {
    role: 'assistant';
    name?: string;
    content: null;
    function_call: { name: string; arguments: string };
  };
  /** Message with the result of a function call. */
  export type FuncResult = {
    role: 'function';
    name: string;
    content: string;
  };
  export type ChatMessage = ChatModel.Message;
}

/** Utility class for creating and checking message types. */
export class Msg {
  /** Create a system message. */
  static system(content: string, name?: string): Msg.System {
    return { role: 'system', content, ...(name ? { name } : {}) };
  }
  /** Create a user message. */
  static user(content: string, name?: string): Msg.User {
    return { role: 'user', content, ...(name ? { name } : {}) };
  }
  /** Create an assistant message. */
  static assistant(content: string, name?: string): Msg.Assistant {
    return { role: 'assistant', content, ...(name ? { name } : {}) };
  }
  /** Create a function call message with argumets. */
  static funcCall(
    function_call: { name: string; arguments: string },
    name?: string
  ): Msg.FuncCall {
    return {
      role: 'assistant',
      content: null,
      function_call,
      ...(name ? { name } : {}),
    };
  }
  /** Create a function result message. */
  static funcResult(content: string, name: string): Msg.FuncResult {
    return { role: 'function', content, name };
  }

  /** Get the narrowed message from an EnrichedResponse. */
  static getMessage(
    response: ChatModel.EnrichedResponse
  ): Msg.Assistant | Msg.FuncCall {
    const msg: ChatModel.Message = response.choices[0].message;
    return this.narrowResponseMessage(msg);
  }

  /** Narrow a message received from the API. It only responds with role=assistant */
  static narrowResponseMessage(
    msg: ChatModel.Message
  ): Msg.Assistant | Msg.FuncCall {
    if (msg.content === null && msg.function_call != null) {
      return Msg.funcCall(msg.function_call);
    } else if (msg.content !== null) {
      return Msg.assistant(msg.content, msg.name);
    } else {
      // @TODO: probably don't want to error here
      console.log('Invalid message', msg);
      throw new Error('Invalid message');
    }
  }

  /** Check if a message is a system message. */
  static isSystem(message: ChatModel.Message): message is Msg.System {
    return message.role === 'system';
  }
  /** Check if a message is a user message. */
  static isUser(message: ChatModel.Message): message is Msg.User {
    return message.role === 'user';
  }
  /** Check if a message is an assistant message. */
  static isAssistant(message: ChatModel.Message): message is Msg.Assistant {
    return message.role === 'assistant' && message.content !== null;
  }
  /** Check if a message is a function call message with arguments. */
  static isFuncCall(message: ChatModel.Message): message is Msg.FuncCall {
    return message.role === 'assistant' && message.function_call != null;
  }
  /** Check if a message is a function result message. */
  static isFuncResult(message: ChatModel.Message): message is Msg.FuncResult {
    return message.role === 'function' && message.name != null;
  }

  /** Narrow a ChatModel.Message to a specific type. */
  static narrow(message: Msg.System): Msg.System;
  static narrow(message: Msg.User): Msg.User;
  static narrow(message: Msg.Assistant): Msg.Assistant;
  static narrow(message: Msg.FuncCall): Msg.FuncCall;
  static narrow(message: Msg.FuncResult): Msg.FuncResult;
  static narrow(
    message: ChatModel.Message
  ): Msg.System | Msg.User | Msg.Assistant | Msg.FuncCall | Msg.FuncResult {
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