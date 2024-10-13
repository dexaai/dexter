import 'dotenv/config';

import { ChatModel } from '@dexaai/dexter';
import { createAIExtractFunction } from '@dexaai/dexter/ai-function';
import { z } from 'zod';

/** A function to extract people names from text. */
const extractPeopleNamesRunner = createAIExtractFunction({
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

/**
 * npx tsx examples/extract-people-names.ts
 */
async function main() {
  // Use OpenAI functions to extract data adhering to a Zod schema
  const peopleNames = await extractPeopleNamesRunner(
    `Dr. Andrew Huberman interviewed Tony Hawk, an idol of Andrew Hubermans.`
  );
  console.log('peopleNames', peopleNames);
}

main().catch(console.error);
