import 'dotenv/config.js';
import { z } from 'zod';
import { createChain } from './chain/chain.js';
import type { ChatModel } from './index.js';
import { Msg, OpenAIChatModel } from './index.js';
import { createAiFunction } from './utils/ai-function.js';

const model = new OpenAIChatModel({
  // Log responses to console for debugging
  hooks: { onResponse: [async (...args) => console.log(...args)] },
});

// @ts-ignore
const simpleChain = createChain({
  model,
  // The type of args is inferred to be the args of simpleChain()
  prompt: async (args: { name: string }) => [
    Msg.system('You tell 1 paragraph long stories about celebrities.'),
    Msg.user(`Tell me a story about ${args.name}`),
  ],
  // The return type of the validator is inferred to be the return type of simpleChain()
  validator: async (message: ChatModel.Message) => {
    const content = message.content;
    if (!message.content?.includes('born')) {
      return { data: null, error: 'The story must include the word "born"' };
    }
    return { data: content!, error: null };
  },
  // Retry once if validation fails
  retries: 1,
});

const ageFunc = createAiFunction(
  {
    name: 'extract_age',
    argsSchema: z.object({
      age: z.number().describe('The age of the person'),
    }),
  },
  async (args) => args
);

const zodChain = createChain({
  model: model.addParams({
    functions: [ageFunc.spec],
  }),
  prompt: (args: { text: string }) => [
    Msg.system("You extract a person's age from a sentence."),
    Msg.user(`How old is ${args.text}?`),
  ],
  validator: ageFunc.parseArgs,
  retries: 1,
});

async function main() {
  const res = await zodChain({ text: 'Bill Murray is fifty' });
  console.log(res);
}

main();
