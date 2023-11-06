import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { chunkDatastore, type Chunk } from './tools.js';

async function main() {
  const chunks = await loadChunks();
  const docs = chunks.map((chunk) => ({
    id: chunk.chunkId,
    metadata: chunk,
  }));

  console.log(`Upserting ${chunks.length} chunks...`);

  const start = Date.now();
  await chunkDatastore.upsert(docs);
  const end = Date.now();

  console.log(`Upserted ${chunks.length} chunks in ${end - start}ms`);
}

// From: https://huggingface.co/datasets/dexaai/huberman_on_exercise
async function loadChunks(): Promise<Chunk[]> {
  const json = JSON.parse(
    await readFile('./examples/chatbot/data.json', 'utf8')
  );
  const rows = json.rows.map((row: any) => row.row);
  const chunks: Chunk[] = rows.map((row: any) => ({
    chunkId: row.id,
    chunkTitle: row.metadata.chunkTitle,
    episodeTitle: row.metadata.episodeTitle,
    imgUrl: row.metadata.imgUrl,
    published: row.metadata.published,
    url: row.metadata.url,
    transcript: row.document,
  }));
  return chunks;
}

main();
