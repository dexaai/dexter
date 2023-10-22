import type { ChatModel } from '../chat/types.js';

/**
 * Generic interface for a model tokenizer
 */
export interface ITokenizer {
  /** Tokenize a string into an array of integer tokens */
  encode(text: string): Uint32Array;
  /** Decode an array of integer tokens into a string */
  decode(tokens: number[] | Uint32Array): string;
  /**
   * Count the number of tokens in a string or ChatMessage(s).
   * A single ChatMessage is counted as a completion and an array as a prompt.
   * Strings are counted as is.
   */
  countTokens(input?: string | ChatModel.Message | ChatModel.Message[]): number;
  /** Truncate a string to a maximum number of tokens */
  truncate(args: {
    /** Text to truncate */
    text: string;
    /** Maximum number of tokens to keep (inclusive) */
    max: number;
    /** Truncate from the start or end of the text */
    from?: 'start' | 'end';
  }): string;
}

export type CreateTokenizer = (model: string) => ITokenizer;
