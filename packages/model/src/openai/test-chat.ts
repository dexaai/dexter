import 'dotenv/config.js';
import { ChatModel } from './chat.js';

(async () => {
  const model = new ChatModel({
    params: {
      model: 'gpt-3.5-turbo',
    },
  });
  const data = await model.run({
    handleUpdate: console.log,
    messages: [
      {
        role: 'user',
        content: "Hello, I'm a human. Are you?",
      },
    ],
  });
  console.log(data);
})();
