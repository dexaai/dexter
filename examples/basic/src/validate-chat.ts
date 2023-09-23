import 'dotenv/config';
import { z } from 'zod';
import { ChatModel } from '@dexaai/model/openai';

/**
 * This shows how to use the OpenAI chat completion and validate the
 * response using a Zod schema, with a retry on failure.
 */
(async () => {
  // Create a ChatModel with aggressive logging
  const chatModel = new ChatModel({
    debug: true,
    params: { model: 'gpt-3.5-turbo' },
    hooks: { afterApiResponse: console.log },
  });

  // A schema that the initial response is likely to fail
  const schema = z.object({
    state: z.string().max(2),
  });

  const { state } = await chatModel.runWithValidation(schema, {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `
You help users identify states and always respond with only JSON in this shape:
{ "state": "<the state>" }`,
      },
      {
        role: 'user',
        content: `What state is New York City in?`,
      },
    ],
  });
  console.log('State:', state);
})();
