import type { ChatMessage } from 'openai-fetch';
import { OpenAIClient } from 'openai-fetch';
import type { Model } from '../types2.js';

/** Cached OpenAI clients. */
const cachedClients = new Map<string, OpenAIClient>();

/** Create a new openai-fetch OpenAIClient. */
export function createOpenAIClient(
  /** Options to pass to the OpenAI client. */
  opts?: ConstructorParameters<typeof OpenAIClient>[0],
  /** Force a new client to be created. */
  forceNew = false
): OpenAIClient {
  if (!forceNew) {
    const cachedClient = cachedClients.get(JSON.stringify(opts));
    if (cachedClient) return cachedClient;
  }

  const client = new OpenAIClient(opts);
  cachedClients.set(JSON.stringify(opts), client);

  return client;
}

/** Extract tokens from an OpenAI API response */
export function extractTokens(
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  }
) {
  const tokens: Model.TokenCounts = {
    prompt: usage?.['prompt_tokens'] ?? 0,
    completion: usage?.['completion_tokens'] ?? 0,
    total: usage?.['total_tokens'] ?? 0,
  };
  return tokens;
}

/** Reformat name to adhere to OpenAI's naming restrictions: /^[a-zA-Z0-9_-]{1,64}$/ */
export function formatName<Msg extends ChatMessage>(message: Msg): Msg {
  const { name, role, content } = message;

  // Remove the name key if it's empty.
  if (!name) return { role, content } as Msg;

  // Reformat to meet OpenAI's naming restrictions.
  const formattedName = name
    .replace(/\s/g, '-')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase();

  return { role, name: formattedName, content } as Msg;
}
