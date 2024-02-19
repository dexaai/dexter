/** Calculate the cost (in cents) for the given model and tokens. */
export declare function calculateCost(args: {
    model: string;
    tokens?: {
        prompt_tokens: number;
        completion_tokens?: number;
    };
}): number | undefined;
