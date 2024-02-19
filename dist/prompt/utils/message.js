import dedent from 'dedent';
import { stringifyForModel } from '../functions/stringify-for-model.js';
/**
 * Clean a string by removing extra newlines and indentation.
 * @see: https://github.com/dmnd/dedent
 */
export function cleanString(text) {
    // TODO: Should this trim the output as well? could be useful for multiline
    // templated strings which begin or end with unnecessary newlines.
    const dedenter = dedent.withOptions({ escapeSpecialCharacters: true });
    return dedenter(text);
}
/** Utility class for creating and checking message types. */
export class Msg {
    /** Create a system message. Cleans indentation and newlines by default. */
    static system(content, opts) {
        const { name, cleanContent = true } = opts ?? {};
        return {
            role: 'system',
            content: cleanContent ? cleanString(content) : content,
            ...(name ? { name } : {}),
        };
    }
    /** Create a user message. Cleans indentation and newlines by default. */
    static user(content, opts) {
        const { name, cleanContent = true } = opts ?? {};
        return {
            role: 'user',
            content: cleanContent ? cleanString(content) : content,
            ...(name ? { name } : {}),
        };
    }
    /** Create an assistant message. Cleans indentation and newlines by default. */
    static assistant(content, opts) {
        const { name, cleanContent = true } = opts ?? {};
        return {
            role: 'assistant',
            content: cleanContent ? cleanString(content) : content,
            ...(name ? { name } : {}),
        };
    }
    /** Create a function call message with argumets. */
    static funcCall(function_call, opts) {
        return {
            ...opts,
            role: 'assistant',
            content: null,
            function_call,
        };
    }
    /** Create a function result message. */
    static funcResult(content, name) {
        const contentString = stringifyForModel(content);
        return { role: 'function', content: contentString, name };
    }
    /** Create a function call message with argumets. */
    static toolCall(tool_calls, opts) {
        return {
            ...opts,
            role: 'assistant',
            content: null,
            tool_calls,
        };
    }
    /** Create a tool call result message. */
    static toolResult(content, tool_call_id, opts) {
        const contentString = stringifyForModel(content);
        return { ...opts, role: 'tool', tool_call_id, content: contentString };
    }
    /** Get the narrowed message from an EnrichedResponse. */
    static getMessage(
    // @TODO
    response
    // response: ChatModel.EnrichedResponse
    ) {
        const msg = response.choices[0].message;
        return this.narrowResponseMessage(msg);
    }
    /** Narrow a message received from the API. It only responds with role=assistant */
    static narrowResponseMessage(msg) {
        if (msg.content === null && msg.tool_calls != null) {
            return Msg.toolCall(msg.tool_calls);
        }
        else if (msg.content === null && msg.function_call != null) {
            return Msg.funcCall(msg.function_call);
        }
        else if (msg.content !== null) {
            return Msg.assistant(msg.content);
        }
        else {
            // @TODO: probably don't want to error here
            console.log('Invalid message', msg);
            throw new Error('Invalid message');
        }
    }
    /** Check if a message is a system message. */
    static isSystem(message) {
        return message.role === 'system';
    }
    /** Check if a message is a user message. */
    static isUser(message) {
        return message.role === 'user';
    }
    /** Check if a message is an assistant message. */
    static isAssistant(message) {
        return message.role === 'assistant' && message.content !== null;
    }
    /** Check if a message is a function call message with arguments. */
    static isFuncCall(message) {
        return message.role === 'assistant' && message.function_call != null;
    }
    /** Check if a message is a function result message. */
    static isFuncResult(message) {
        return message.role === 'function' && message.name != null;
    }
    /** Check if a message is a tool calls message. */
    static isToolCall(message) {
        return message.role === 'assistant' && message.tool_calls != null;
    }
    /** Check if a message is a tool call result message. */
    static isToolResult(message) {
        return message.role === 'tool' && !!message.tool_call_id;
    }
    static narrow(message) {
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
//# sourceMappingURL=message.js.map