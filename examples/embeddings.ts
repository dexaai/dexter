import 'dotenv/config';

import { createOpenAIClient, EmbeddingModel } from '../src/index.js';

/**
 * npx tsx examples/ai-function.ts
 */
async function main() {
  const embeddingModel = new EmbeddingModel({
    client: createOpenAIClient(),
    params: { model: 'text-embedding-3-small' },
  });

  {
    // Invoke the chat model and have it create the args for the `get_weather` function
    const response = await embeddingModel.run({
      input: ['What is the weather in San Francisco?'],
      model: 'text-embedding-3-small',
    });

    console.log(response);
  }
}

main();
