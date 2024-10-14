import * as readline from 'node:readline';

import chalk from 'chalk';

import { type Msg, MsgUtil } from '../model/index.js';
import { Swarm } from './swarm.js';
import { type Agent } from './types.js';

function prettyPrintMessages(messages: Msg[]): void {
  for (const message of messages) {
    // Print tool results
    if (MsgUtil.isToolResult(message)) {
      const { content } = message;
      console.log(`<== ${chalk.green(content)}`);
    }

    if (message.role !== 'assistant') continue;

    // Print agent name in blue
    if ('name' in message) {
      process.stdout.write(`${chalk.blue(message.name || '')}: `);
    }

    // Print response, if any
    if (message.content) {
      console.log(message.content);
    }

    // Print tool calls in purple, if any
    const toolCalls = MsgUtil.isToolCall(message) ? message.tool_calls : [];
    if (toolCalls.length > 1) {
      console.log();
    }
    for (const toolCall of toolCalls) {
      const { name, arguments: args } = toolCall.function;
      const argObj = JSON.parse(args);
      const argStr = JSON.stringify(argObj).replace(/:/g, '=');
      if (name.startsWith('transfer_')) {
        console.log(`<> ${chalk.yellow(name)}(${argStr.slice(1, -1)})`);
      } else {
        console.log(`${chalk.magenta(name)}(${argStr.slice(1, -1)})`);
      }
    }
  }
}

export async function runSwarmRepl(
  startingAgent: Agent,
  contextVariables: Record<string, any> = {}
): Promise<void> {
  const client = new Swarm();
  console.log('Swarm initialized.');

  let messages: Msg[] = [];
  let agent = startingAgent;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userInput = await new Promise<string>((resolve) => {
      rl.question(`${chalk.gray('User')}: `, resolve);
    });

    messages.push({ role: 'user', content: userInput });

    const response = await client.run({
      agent,
      messages,
      ctx: contextVariables,
    });

    prettyPrintMessages(response.messages);
    messages = messages.concat(response.messages);
    agent = response.agent;
  }
}
