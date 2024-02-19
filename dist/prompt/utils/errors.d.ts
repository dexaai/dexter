export declare class AbortError extends Error {
    readonly name: 'AbortError';
    readonly originalError: Error;
    constructor(message: string | Error);
}
