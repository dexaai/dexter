import 'dotenv/config';
import { z } from 'zod';
import { ExtractFunction } from '@dexaai/functions';
import { ChatModel } from '@dexaai/model/openai';

/**
 * This shows how to use OpenAI functions to extract structured
 * data from a string.
 */
(async () => {
  // Create a function that extracts a location from a string.
  const extractLocation = new ExtractFunction({
    name: 'parse_location',
    description: `Parse the city and state from a string.`,
    schema: z.object({
      city: z.string().describe('The name of a city'),
      state: z.string().min(1).describe(
        // This is intentionally vague to test the validation.
        `The name of the state the city is in. Infer from the city if possible.`
      ),
    }),
    // This is optional, but can be used for further validation.
    validate: ({ state }) => {
      if (state !== state.toUpperCase()) {
        throw new Error(`State must be 2 uppercase letters`);
      }
    },
    // Optionally pass in a model to use.
    model: new ChatModel({
      params: { model: 'gpt-3.5-turbo' },
      hooks: { afterApiResponse: console.log },
      debug: true,
    }),
  });

  // This will likely retry because the state is not uppercase.
  console.log(await extractLocation.run('I live in Brooklyn, New York'));

  console.log('---');

  // This will likely succeed first try.
  console.log(await extractLocation.run('I live in Brooklyn, NY'));
})();
