import { chatModel, chunkDatastore } from './tools.js';
import type { Prompt } from '../src/prompt/index.js';
import { Msg } from '../src/prompt/index.js';

const system = Msg.system(`
  You are a helpful and accurate Q&A bot.
  You answer the user's QUESTION, based only on the PROVIDED_CONTEXT.
  Your answer should be at most 100 words long.
  You use Markdown footnotes to cite the chunkId of the PROVIDED_CONTEXT that
  you used for each part of your answer. (Eg: [^1])
`);

function userMsg(query: string, chunks: unknown[]) {
  return Msg.user(`
    QUESTION: ${query}
    PROVIDED_CONTEXT:
    \`\`\`json
    ${JSON.stringify(chunks, null, 2)}
    \`\`\`
  `);
}

export async function generateAnswer(
  query: string,
  history: Prompt.Msg[]
): Promise<Prompt.Msg> {
  const results = await chunkDatastore.query({ query, topK: 5 });
  const chunks = results.docs.map((doc) => doc.metadata);
  const messages = [system, ...history.slice(-5), userMsg(query, chunks)];
  const { message } = await chatModel.run({
    messages,
    handleUpdate: (c) => process.stdout.write(c),
  });
  return message;
}
