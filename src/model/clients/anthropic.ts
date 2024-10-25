import { AnthropicClient } from 'anthropic-fetch';

/** Cached Anthropic clients. */
const cachedClients = new Map<string, AnthropicClient>();

/** Create a new anthropic-fetch AnthropicClient. */
export function createAnthropicClient(
  /** Options to pass to the Anthropic client. */
  opts?: ConstructorParameters<typeof AnthropicClient>[0],
  /** Force a new client to be created. */
  forceNew = false
): AnthropicClient {
  if (!forceNew) {
    const cachedClient = cachedClients.get(JSON.stringify(opts));
    if (cachedClient) return cachedClient;
  }

  const client = new AnthropicClient(opts);
  cachedClients.set(JSON.stringify(opts), client);

  return client;
}
