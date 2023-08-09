import 'dotenv/config';
import { Calculator } from 'workgpt/apis/calculator';
import { FactApi } from 'workgpt/apis/fact';
import { createRunner } from '@dexaai/agent';

const apis = await Promise.all([new Calculator(), new FactApi()]);
const runner = createRunner(apis, undefined, true);

await runner.runWithDirective(
  'What is the age of obama multiplied by the age of trump?'
);

console.log('--- Done ---');
