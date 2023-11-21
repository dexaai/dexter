import 'dotenv/config';
import { z } from 'zod';
import {
  ChatModel,
  createAIFunction,
  createAIChain,
  Msg,
} from '@dexaai/dexter';

/**
 * npx tsx examples/ai-chain.ts
 */
async function main() {
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
    // Fake weather API implementation which returns a random temperature
    // after a short delay
    async (args: { location: string; unit?: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        location: args.location,
        unit: args.unit,
        temperature: (30 + Math.random() * 70) | 0,
      };
    }
  );

  const chatModel = new ChatModel({
    debug: true,
    params: {
      model: 'gpt-4-1106-preview',
      temperature: 0.5,
      max_tokens: 500,
    },
  });

  const weatherChain = createAIChain({
    chatModel,
    functions: [getWeather],
    prompt: ({ location }: { location: string }) => [
      Msg.user(`What is the weather in ${location}?`),
    ],
  });

  const result = await weatherChain({ location: 'San Francisco' });
  console.log(result);
}

main();
