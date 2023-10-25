import 'dotenv/config.js';
import { CompletionModel } from './completion.js';

(async () => {
  const model = new CompletionModel();
  const data = await model.run({
    prompt: ['Who is bill murray?'],
  });
  console.log(data);
})();
