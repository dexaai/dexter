import 'dotenv/config.js';
import { CompletionModel } from './completion.js';

(async () => {
  const model = new CompletionModel({
    context: { model: 1 },
  });
  const data = await model.run({
    prompt: ['Who is bill murray?'],
  });
  console.log(data);

  const model2 = model.clone({
    context: { model: 2 },
  });
  const data2 = await model2.run({
    prompt: ['Who is bill murray?'],
  });
  console.log(data2);
})();
