import 'dotenv/config.js';
import readline from 'readline';
import { generateAnswer } from './answer.js';
import type { Prompt } from '../src/prompt/types.js';

const history: Prompt.Msg[] = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(): Promise<string> {
  return new Promise((resolve) => rl.question('> ', resolve));
}

console.log('Welcome to Huberman chat. Enter your question to begin.');

while (true) {
  const query = await askQuestion();
  process.stdout.write('Huberman: ');
  const answer = await generateAnswer(query, history);
  process.stdout.write('\n\n');
  history.push(answer);
}
