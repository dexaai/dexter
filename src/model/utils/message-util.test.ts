import type * as OpenAI from 'openai-fetch';
import { describe, expect, it } from 'vitest';

import { type Msg } from '../types.js';
import { MsgUtil } from './message-util.js';

describe('Msg', () => {
  it('creates a message and fixes indentation', () => {
    const msgContent = `
      Hello, World!
    `;
    const msg = MsgUtil.system(msgContent);
    expect(msg.role).toEqual('system');
    expect(msg.content).toEqual('Hello, World!');
  });

  it('supports disabling indentation fixing', () => {
    const msgContent = `
      Hello, World!
    `;
    const msg = MsgUtil.system(msgContent, { cleanContent: false });
    expect(msg.content).toEqual('\n      Hello, World!\n    ');
  });

  it('handles tool calls request', () => {
    const msg = MsgUtil.toolCall([
      {
        id: 'fake-tool-call-id',
        type: 'function',
        function: {
          arguments: '{"prompt": "Hello, World!"}',
          name: 'hello',
        },
      },
    ]);
    expectTypeOf(msg).toMatchTypeOf<Msg.ToolCall>();
    expect(MsgUtil.isToolCall(msg)).toBe(true);
  });

  it('handles tool call response', () => {
    const msg = MsgUtil.toolResult('Hello, World!', 'fake-tool-call-id');
    expectTypeOf(msg).toMatchTypeOf<Msg.ToolResult>();
    expect(MsgUtil.isToolResult(msg)).toBe(true);
  });

  // Same as OpenAI.ChatMessage, except we throw a RefusalError if the message is a refusal
  // so `refusal` isn't on the object and content can't be optional.
  it('prompt message types should interop with openai-fetch message types', () => {
    // TODO: get the types to fully align
    // expectTypeOf(
    //   {} as Omit<OpenAI.ChatMessage, 'refusal'> & { content: string | null }
    // ).toMatchTypeOf<Msg>();
    expectTypeOf({} as Msg).toMatchTypeOf<OpenAI.ChatMessage>();
    expectTypeOf({} as Msg.System).toMatchTypeOf<OpenAI.ChatMessage>();
    expectTypeOf({} as Msg.User).toMatchTypeOf<OpenAI.ChatMessage>();
    expectTypeOf({} as Msg.Assistant).toMatchTypeOf<OpenAI.ChatMessage>();
    expectTypeOf({} as Msg.FuncCall).toMatchTypeOf<OpenAI.ChatMessage>();
    expectTypeOf({} as Msg.FuncResult).toMatchTypeOf<OpenAI.ChatMessage>();
  });
});
