import type { Tiktoken } from 'tiktoken';
import type { ChatMessage } from 'openai-fetch';
import type { Model } from '../types.js';
/** Create a tokenizer for a specific model */
export declare const createTokenizer: (model: string) => Tokenizer;
declare class Tokenizer implements Model.ITokenizer {
    model: string;
    tiktoken: Tiktoken;
    constructor(model: string);
    /** Encode text to tokens */
    encode(text: string): Uint32Array;
    /** Decode tokens to text */
    decode(tokens: number[] | Uint32Array): string;
    /**
     * Count the number of tokens in a string or ChatMessage(s)
     * A single message is counted as a completion and an array as a prompt
     **/
    countTokens(input?: string | ChatMessage | ChatMessage[]): number;
    /** Truncate text to a maximum number of tokens */
    truncate(args: {
        /** Text to truncate */
        text: string;
        /** Maximum number of tokens to keep (inclusive) */
        max: number;
        /** Truncate from the start or end of the text */
        from?: 'start' | 'end';
    }): string;
    /** Check if the given model is a GPT-4 variant. */
    private isGpt4Model;
}
export {};
