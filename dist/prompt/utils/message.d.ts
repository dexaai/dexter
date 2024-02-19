import type { Jsonifiable } from 'type-fest';
import type { Prompt } from '../types.js';
/**
 * Clean a string by removing extra newlines and indentation.
 * @see: https://github.com/dmnd/dedent
 */
export declare function cleanString(text: string): string;
/** Utility class for creating and checking message types. */
export declare class Msg {
    /** Create a system message. Cleans indentation and newlines by default. */
    static system(content: string, opts?: {
        /** Custom name for the message. */
        name?: string;
        /** Whether to clean extra newlines and indentation. Defaults to true. */
        cleanContent?: boolean;
    }): Prompt.Msg.System;
    /** Create a user message. Cleans indentation and newlines by default. */
    static user(content: string, opts?: {
        /** Custom name for the message. */
        name?: string;
        /** Whether to clean extra newlines and indentation. Defaults to true. */
        cleanContent?: boolean;
    }): Prompt.Msg.User;
    /** Create an assistant message. Cleans indentation and newlines by default. */
    static assistant(content: string, opts?: {
        /** Custom name for the message. */
        name?: string;
        /** Whether to clean extra newlines and indentation. Defaults to true. */
        cleanContent?: boolean;
    }): Prompt.Msg.Assistant;
    /** Create a function call message with argumets. */
    static funcCall(function_call: {
        /** Name of the function to call. */
        name: string;
        /** Arguments to pass to the function. */
        arguments: string;
    }, opts?: {
        /** The name descriptor for the message.(message.name) */
        name?: string;
    }): Prompt.Msg.FuncCall;
    /** Create a function result message. */
    static funcResult(content: Jsonifiable, name: string): Prompt.Msg.FuncResult;
    /** Create a function call message with argumets. */
    static toolCall(tool_calls: Prompt.Msg.Call.Tool[], opts?: {
        /** The name descriptor for the message.(message.name) */
        name?: string;
    }): Prompt.Msg.ToolCall;
    /** Create a tool call result message. */
    static toolResult(content: Jsonifiable, tool_call_id: string, opts?: {
        /** The name of the tool which was called */
        name?: string;
    }): Prompt.Msg.ToolResult;
    /** Get the narrowed message from an EnrichedResponse. */
    static getMessage(response: any): Prompt.Msg.Assistant | Prompt.Msg.FuncCall | Prompt.Msg.ToolCall;
    /** Narrow a message received from the API. It only responds with role=assistant */
    static narrowResponseMessage(msg: Prompt.Msg): Prompt.Msg.Assistant | Prompt.Msg.FuncCall | Prompt.Msg.ToolCall;
    /** Check if a message is a system message. */
    static isSystem(message: Prompt.Msg): message is Prompt.Msg.System;
    /** Check if a message is a user message. */
    static isUser(message: Prompt.Msg): message is Prompt.Msg.User;
    /** Check if a message is an assistant message. */
    static isAssistant(message: Prompt.Msg): message is Prompt.Msg.Assistant;
    /** Check if a message is a function call message with arguments. */
    static isFuncCall(message: Prompt.Msg): message is Prompt.Msg.FuncCall;
    /** Check if a message is a function result message. */
    static isFuncResult(message: Prompt.Msg): message is Prompt.Msg.FuncResult;
    /** Check if a message is a tool calls message. */
    static isToolCall(message: Prompt.Msg): message is Prompt.Msg.ToolCall;
    /** Check if a message is a tool call result message. */
    static isToolResult(message: Prompt.Msg): message is Prompt.Msg.ToolResult;
    /** Narrow a ChatModel.Message to a specific type. */
    static narrow(message: Prompt.Msg.System): Prompt.Msg.System;
    static narrow(message: Prompt.Msg.User): Prompt.Msg.User;
    static narrow(message: Prompt.Msg.Assistant): Prompt.Msg.Assistant;
    static narrow(message: Prompt.Msg.FuncCall): Prompt.Msg.FuncCall;
    static narrow(message: Prompt.Msg.FuncResult): Prompt.Msg.FuncResult;
    static narrow(message: Prompt.Msg.ToolCall): Prompt.Msg.ToolCall;
    static narrow(message: Prompt.Msg.ToolResult): Prompt.Msg.ToolResult;
}
