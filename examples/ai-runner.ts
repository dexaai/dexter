import 'dotenv/config';
import { z } from 'zod';
import {
  ChatModel,
  Msg,
  createAIFunction,
  createAIRunner,
} from '@dexaai/dexter';

/** Get the weather for a given location. */
const getWeather = createAIFunction(
  {
    name: 'get_weather',
    description: 'Gets the weather for a given location',
    argsSchema: z.object({
      location: z
        .string()
        .describe('The city and state e.g. San Francisco, CA'),
      unit: z
        .enum(['c', 'f'])
        .optional()
        .default('f')
        .describe('The unit of temperature to use'),
    }),
  },
  async ({ location, unit }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const temperature = (30 + Math.random() * 70) | 0;
    return { location, unit, temperature };
  }
);

/** Get the capital city for a given state. */
const getCapitalCity = createAIFunction(
  {
    name: 'get_capital_city',
    description: 'Use this to get the the capital city for a given state',
    argsSchema: z.object({
      state: z
        .string()
        .length(2)
        .describe(
          'The state to get the capital city for, using the two letter abbreviation e.g. CA'
        ),
    }),
  },
  async ({ state }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let capitalCity = '';
    switch (state) {
      case 'CA':
        capitalCity = 'Sacramento';
        break;
      case 'NY':
        capitalCity = 'Albany';
        break;
      default:
        capitalCity = 'Unknown';
    }
    return { capitalCity };
  }
);

/** A runner that uses the weather and capital city functions. */
const weatherCapitalRunner = createAIRunner({
  chatModel: new ChatModel({ params: { model: 'gpt-4-1106-preview' } }),
  functions: [getWeather, getCapitalCity],
  systemMessage: `You use functions to answer questions about the weather and capital cities.`,
});

/**
 * npx tsx examples/ai-runner.ts
 */
async function main() {
  // Run with a string input
  const rString = await weatherCapitalRunner(
    `Whats the capital of California and NY and the weather for both`
  );
  console.log('rString', rString);

  // Run with a message input
  const rMessage = await weatherCapitalRunner({
    messages: [
      Msg.user(
        `Whats the capital of California and NY and the weather for both`
      ),
    ],
  });
  console.log('rMessage', rMessage);
}

main().catch(console.error);
