type ErrorWithMessage = {
    message: string;
};
export declare function toErrorWithMsg(maybeError: unknown): ErrorWithMessage;
/** Get the error message string from an unknown type. */
export declare function getErrorMsg(error: unknown): string;
export {};
