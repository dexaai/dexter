import { encoding_for_model } from 'tiktoken';
import type { Tiktoken, TiktokenModel } from 'tiktoken';
import type { ChatMessage } from 'openai-fetch';
import type { Model } from '../types.js';

// Store instances of the tokenizer to avoid re-creating them for the same model
const tokenizerCache = new Map<string, Tokenizer>();

/** Create a tokenizer for a specific model */
export const createTokenizer: (model: string) => Tokenizer = (
  model: string
) => {
  if (tokenizerCache.has(model)) {
    return tokenizerCache.get(model)!;
  } else {
    const tokenizer = new Tokenizer(model);
    tokenizerCache.set(model, tokenizer);
    return tokenizer;
  }
};

const GPT_4_MODELS = [
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-0613',
  'gpt-4-1106',
  'gpt-4-1106-preview',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'gpt-4-32k-0613',
  'gpt-4-turbo',
  'gpt-4-vision-preview',
] as const;
type Gpt4ModelName = (typeof GPT_4_MODELS)[number];

class Tokenizer implements Model.ITokenizer {
  model: string;
  tiktoken: Tiktoken;

  constructor(model: string) {
    this.model = model;
    try {
      this.tiktoken = encoding_for_model(model as TiktokenModel);
    } catch (e) {
      this.tiktoken = encoding_for_model('gpt-3.5-turbo');
    }
  }

  /** Encode text to tokens */
  encode(text: string): Uint32Array {
    return this.tiktoken.encode(text);
  }

  /** Decode tokens to text */
  decode(tokens: number[] | Uint32Array): string {
    const toDecode = Array.isArray(tokens) ? new Uint32Array(tokens) : tokens;
    return new TextDecoder().decode(this.tiktoken.decode(toDecode));
  }

  /**
   * Count the number of tokens in a string or ChatMessage(s)
   * A single message is counted as a completion and an array as a prompt
   **/
  countTokens(input?: string | ChatMessage | ChatMessage[]): number {
    if (!input) return 0;
    if (typeof input === 'string') {
      return this.tiktoken.encode(input).length;
    } else if (Array.isArray(input)) {
      // This is copied from OpenAI's Python implementation: https://github.com/openai/openai-cookbook/blob/main/examples/How_to_format_inputs_to_ChatGPT_models.ipynb
      // NOTE: The array version assumes this is for the prompt and adds more tokens.
      // Use the single ChatMessage for completion token count.
      // The tokensPerName and tokensPerMessage will need to be updated over time
      const isGpt4 = this.isGpt4Model(this.model);
      const tokensPerMessage = isGpt4 ? 3 : 4;
      let numTokens = 0;

      for (const message of input) {
        numTokens += tokensPerMessage;
        if (message.content) {
          numTokens += this.countTokens(message.content);
        }
        // The name+role are handled differently for GPT-3.5 vs GPT-4
        if (isGpt4) {
          // For 4, the name and role are included
          // Details here: https://github.com/openai/openai-python/blob/main/chatml.md
          numTokens += 1; // role
          if (message.name) {
            // No idea why this, but tested with many examples and it works...
            numTokens += this.countTokens(`${message.name}`) + 1;
          }
        } else {
          // For 3.5, the name replaces the role if it's present
          numTokens += this.countTokens(message.name || message.role);
        }
      }

      // Every reply is primed with assistant
      numTokens += 3;

      return numTokens;
    } else {
      return this.countTokens(input.content || '');
    }
  }

  /** Truncate text to a maximum number of tokens */
  truncate(args: {
    /** Text to truncate */
    text: string;
    /** Maximum number of tokens to keep (inclusive) */
    max: number;
    /** Truncate from the start or end of the text */
    from?: 'start' | 'end';
  }): string {
    const { text, max, from = 'start' } = args;
    const tokens = this.encode(text);

    if (tokens.length <= max) {
      return text;
    }

    const truncatedTokens =
      from === 'start'
        ? tokens.slice(0, max)
        : tokens.slice(tokens.length - max);

    let truncatedText = this.decode(truncatedTokens);

    // Handle edge case where the last token is part of a multi-byte character sequence
    truncatedText = truncatedText.replace(/[\uDC00-\uDFFF]$/, '');

    return truncatedText;
  }

  /** Check if the given model is a GPT-4 variant. */
  private isGpt4Model(model: string): model is Gpt4ModelName {
    return GPT_4_MODELS.includes(model as any);
  }
}
