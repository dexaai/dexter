import { describe, expect, it } from 'vitest';
import { Msg } from './message.js';

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
});
