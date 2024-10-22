import 'dotenv/config';

import { ChatModel, type Msg, MsgUtil } from '@dexaai/dexter';

/**
 * npx tsx examples/abort-chat-completion.ts
 */
async function main() {
  const chatModel = new ChatModel({
    debug: true,
    params: {
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: 1000,
    },
  });

  const messages: Msg[] = [MsgUtil.user(`Write a short story`)];

  {
    const abortController = new AbortController();
    abortController.signal.addEventListener('abort', () => {
      console.log('\n\nAborted');
    });

    try {
      setTimeout(() => {
        abortController.abort();
      }, 2000);

      // Invoke the chat model with the result
      await chatModel.run({
        messages,
        requestOpts: {
          signal: abortController.signal,
        },
        handleUpdate: (c) => {
          // Note: The abort doesn't always cancel the request, so we need to handle when the request is aborted
          // here as well.
          if (abortController.signal.aborted) {
            return;
          }
          process.stdout.write(c);
        },
      });

      // console.log(message.content);
    } catch (error) {
      console.error('Error during chat model run:', error);
    }
  }
}

main();
