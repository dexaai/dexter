import 'dotenv/config';
import { ChatModel, SerperClient } from '@dexaai/dexter';

/**
 * npx tsx examples/tools.ts
 */
async function main() {
  const tools = Array.from(new SerperClient().tools);

  const chatModel = new ChatModel({
    debug: true,
    params: {
      model: 'gpt-4-1106-preview',
      tools,
    },
  });
}

main();
