import 'dotenv/config.js';
import { OEmbeddingModel } from './embedding.js';

(async () => {
  const model = new OEmbeddingModel({
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
