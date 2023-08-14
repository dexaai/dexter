import 'dotenv/config';
import { z } from 'zod';
import { ExtractFunction } from '@dexaai/functions';

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
      state: z
        .string()
        .min(1)
        .describe(
          `The name of the state the city is in. Infer from the city if possible.`
        ),
    }),
    // Optionally pass in a model to use.
    // model: new ChatModel({ params: { model: 'gpt-4' } }),
  });

  // Run the function
  console.log(await extractLocation.run('I live in Brooklyn'));
})();
