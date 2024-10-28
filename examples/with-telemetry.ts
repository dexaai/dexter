import './instrument.js';
import 'dotenv/config';

import * as Sentry from '@sentry/node';

import { ChatModel } from '../src/index.js';

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
