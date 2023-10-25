import 'dotenv/config.js';
import { EmbeddingModel } from './embedding.js';

(async () => {
  const model = new EmbeddingModel({
    params: {
      model: 'text-embedding-ada-002',
      batch: {
        maxBatchSize: 1,
      },
    },
    hooks: { onApiResponse: [console.log] },
  });
  const data = await model.run({
    input: ['big cat', 'dog'],
  });
  console.log(data);
})();
