import 'dotenv/config.js';
import { MemoryCache } from './chat/memory-cache.js';
import { OpenAIChatModel } from './index.js';

(async () => {
  const model = new OpenAIChatModel({
    cache: MemoryCache,
    context: { class: true },
    hooks: {
      onResponse: [
        async (params, response, context) => {
          console.log('onResponse', params, response, context);
        },
      ],
      onError: [
        async (params, error, context) => {
          console.log('onError', params, error, context);
        },
      ],
    },
  });
  const response = await model.generate(
    {
      messages: [
        {
          role: 'user',
          content: 'Hello, how are you?',
        },
      ],
    },
    { first: true }
  );
  console.log(JSON.stringify(response, null, 2));
  const response2 = await model.generate(
    {
      messages: [
        {
          role: 'user',
          content: 'Hello, how are you?',
        },
      ],
    },
    { second: true }
  );
  console.log(JSON.stringify(response2, null, 2));

  const model2 = model.clone(undefined, { model: 2 });
  const response3 = await model2.generate(
    {
      messages: [
        {
          role: 'user',
          content: 'Hello, how are you?',
        },
      ],
    },
    { second: true }
  );
  console.log(JSON.stringify(response3, null, 2));
  console.log(model2);
})();
