import './instrument.js';
import 'dotenv/config';
import { ChatModel } from '@dexaai/dexter';
import * as Sentry from '@sentry/node';

const chatModel = new ChatModel({
  // Send tracing data to Sentry
  telemetry: Sentry,
  params: { model: 'gpt-4o-mini' },
});

async function main() {
  const result = await chatModel.run({
    messages: [{ role: 'user', content: 'Tell me a short joke' }],
  });
  console.log(result);
}

main().catch(console.error);
