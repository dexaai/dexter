import type { ChatMessage } from 'openai-fetch';
import { OpenAIClient } from 'openai-fetch';
import type { TokenCounts } from '../types.js';

let cachedClient: OpenAIClient | undefined;

/** Create a new openai-fetch OpenAIClient. */
export function createOpenAIClient(
  /** Options to pass to the OpenAI client. */
  opts?: ConstructorParameters<typeof OpenAIClient>[0],
  /** Force a new client to be created. */
  forceNew = false
) {
  // Only use a cached client if no options are passed.
  if (opts === undefined && cachedClient && !forceNew) {
    return cachedClient;
  }
  cachedClient = new OpenAIClient(opts);
  return cachedClient;
}

export { OpenAIApiError, OpenAIClient } from 'openai-fetch';

export type {
  ChatCompletionParams as OpenAIChatParams,
  ChatCompletionResponse as OpenAIChatResponse,
  ChatMessageFunction as OpenAIChatFunction,
  ChatMessage,
  CompletionParams as OpenAICompletionParams,
  CompletionResponse as OpenAICompletionResponse,
  EmbeddingParams as OpenAIEmbeddingParams,
  EmbeddingResponse as OpenAIEmbeddingResponse,
} from 'openai-fetch';

/** Extract tokens from an OpenAI API response */
export function extractTokens(
  usage: Record<string, number | undefined> | undefined
) {
  const tokens: TokenCounts = {
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

const CHAT_MODELS = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0301',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'gpt-4-0613',
  'gpt-4-32k-0613',
  'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-16k',
] as const;
export type OpenAIChatModel = (typeof CHAT_MODELS)[number];

const EMBEDDING_MODELS = [
  'text-embedding-ada-002',
  'text-similarity-davinci-001',
  'text-similarity-curie-001',
  'text-similarity-babbage-001',
  'text-similarity-ada-001',
  'text-search-davinci-doc-001',
  'text-search-curie-doc-001',
  'text-search-babbage-doc-001',
  'text-search-ada-doc-001',
  'code-search-babbage-code-001',
  'code-search-ada-code-001',
] as const;
export type OpenAIEmbeddingModel = (typeof EMBEDDING_MODELS)[number];
