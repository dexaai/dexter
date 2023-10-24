import 'dotenv/config.js';
import { OCompletionModel } from './completion.js';

(async () => {
  const model = new OCompletionModel();
  const data = await model.run({
    prompt: ['Who is bill murray?'],
  });
  console.log(data);
})();
