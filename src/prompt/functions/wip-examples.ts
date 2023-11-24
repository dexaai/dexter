import 'dotenv/config';
import { z } from 'zod';
import { ChatModel, Msg, createAIFunction } from '../../index.js';
import { createExtractFunction } from './extract-function.js';
import { createRunner } from './runner.js';

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
const weatherofCapitalRunner = createRunner({
  chatModel: new ChatModel({ params: { model: 'gpt-4-1106-preview' } }),
  functions: [getWeather, getCapitalCity],
  systemMessage: `You use functions to answer questions about the weather and capital cities.`,
});

/** A function to extract people names from a message. */
const extractPeopleNamesRunner = createExtractFunction({
  chatModel: new ChatModel({ params: { model: 'gpt-4-1106-preview' } }),
  systemMessage: `You use functions to extract people names from a message.`,
  name: 'log_people_names',
  description: `Use this to log the full names of people from a message. Don't include duplicate names.`,
  schema: z.object({
    names: z.array(
      z
        .string()
        .describe(
          `The name of a person from the message. Normalize the name by removing suffixes, prefixes, and fixing capitalization`
        )
    ),
  }),
});

async function main() {
  // Use OpenAI functions to extract data adhering to a Zod schema
  const peopleNames = await extractPeopleNamesRunner(
    `Dr. Andrew Huberman interviewed Tony Hawk, an idol of Andrew Hubermans.`
  );
  console.log('peopleNames', peopleNames);

  // Run with a string input
  const rString = await weatherofCapitalRunner(
    `Whats the capital of California and NY and the weather for both`
  );
  console.log('rString', rString);

  // Run with a message input
  const rMessage = await weatherofCapitalRunner({
    messages: [
      Msg.user(
        `Whats the capital of California and NY and the weather for both`
      ),
    ],
  });
  console.log('rMessage', rMessage);
}

main().catch(console.error);
