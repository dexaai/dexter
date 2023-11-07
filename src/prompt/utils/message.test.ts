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
    const msg = Msg.toolCalls([
      {
        id: 'fake-tool-call-id',
        type: 'function',
        function: {
          arguments: '{"prompt": "Hello, World!"}',
          name: 'hello',
        },
      },
    ]);
    expectTypeOf(msg).toMatchTypeOf<Prompt.Msg.ToolCalls>();
    expect(Msg.isToolCallsRequest(msg)).toBe(true);
  });

  it('handles tool call response', () => {
    const msg = Msg.toolCallResult('Hello, World!', 'fake-tool-call-id');
    expectTypeOf(msg).toMatchTypeOf<Prompt.Msg.ToolCallResult>();
    expect(Msg.isToolCallResult(msg)).toBe(true);
  });
});
