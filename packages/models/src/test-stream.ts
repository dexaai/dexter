import 'dotenv/config.js';
import { MemoryCache, OpenAIChatModel } from './index.js';

(async () => {
  const model = new OpenAIChatModel({
    cache: MemoryCache,
  });
  const response = await model.stream(
    { messages: [{ role: 'user', content: 'Hello, how are you?' }] },
    console.log,
    { first: true }
  );
  console.log(JSON.stringify(response, null, 2));
  const response2 = await model.stream(
    { messages: [{ role: 'user', content: 'Hello, how are you?' }] },
    console.log,
    { first: true }
  );
  console.log(JSON.stringify(response2, null, 2));
})();
