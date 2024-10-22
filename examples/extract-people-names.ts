import 'dotenv/config';

import { ChatModel, createExtractFunction } from '@dexaai/dexter';
import { z } from 'zod';

/** A function to extract people names from text. */
const extractPeopleNamesRunner = createExtractFunction({
  chatModel: new ChatModel({ params: { model: 'gpt-4o-mini' } }),
  systemMessage: `You extract the names of people from unstructured text.`,
  name: 'people_names',
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
