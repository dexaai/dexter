import type * as OpenAI from 'openai-fetch';
import { describe, expect, it } from 'vitest';
import { Msg } from './message.js';
import type { Prompt } from '../types.js';

describe('Msg', () => {
  it('creates a message and fixes indentation', () => {
    const msgContent = `
      Hello, World!
    `;
    const msg = Msg.system(msgContent);
    expect(msg.role).toEqual('system');
    expect(msg.content).toEqual('Hello, World!');
  });

  it('supports disabling indentation fixing', () => {
    const msgContent = `
      Hello, World!
    `;
    const msg = Msg.system(msgContent, { cleanContent: false });
    expect(msg.content).toEqual('\n      Hello, World!\n    ');
  });

  it('handles tool calls request', () => {
    const msg = Msg.toolCall([
      {
        id: 'fake-tool-call-id',
        type: 'function',
        function: {
          arguments: '{"prompt": "Hello, World!"}',
          name: 'hello',
        },
      },
    ]);
    expectTypeOf(msg).toMatchTypeOf<Prompt.Msg.ToolCall>();
    expect(Msg.isToolCall(msg)).toBe(true);
  });

  it('handles tool call response', () => {
    const msg = Msg.toolResult('Hello, World!', 'fake-tool-call-id');
    expectTypeOf(msg).toMatchTypeOf<Prompt.Msg.ToolResult>();
    expect(Msg.isToolResult(msg)).toBe(true);
  });

  it('prompt message types should interop with openai-fetch message types', () => {
    expectTypeOf({} as OpenAI.ChatMessage).toMatchTypeOf<Prompt.Msg>();
    expectTypeOf({} as Prompt.Msg).toMatchTypeOf<OpenAI.ChatMessage>();
    expectTypeOf({} as Prompt.Msg.System).toMatchTypeOf<OpenAI.ChatMessage>();
    expectTypeOf({} as Prompt.Msg.User).toMatchTypeOf<OpenAI.ChatMessage>();
    expectTypeOf(
      {} as Prompt.Msg.Assistant
    ).toMatchTypeOf<OpenAI.ChatMessage>();
    expectTypeOf({} as Prompt.Msg.FuncCall).toMatchTypeOf<OpenAI.ChatMessage>();
    expectTypeOf(
      {} as Prompt.Msg.FuncResult
    ).toMatchTypeOf<OpenAI.ChatMessage>();
  });
});
