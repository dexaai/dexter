import { OpenAIClient } from 'openai-fetch';

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

/** Reformat name to adhere to OpenAI's naming restrictions: /^[a-zA-Z0-9_-]{1,64}$/ */
export function formatName(name?: string | null): string | null {
  if (!name) return null;

  // Reformat to meet OpenAI's naming restrictions.
  const formattedName = name
    .replace(/\s/g, '-')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase();

  return formattedName;
}
