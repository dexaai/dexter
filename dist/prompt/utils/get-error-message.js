function isErrorWithMsg(error) {
    return (typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string');
}
export function toErrorWithMsg(maybeError) {
    if (isErrorWithMsg(maybeError))
        return maybeError;
    try {
        return new Error(JSON.stringify(maybeError));
    }
    catch {
        // fallback in case there's an error stringifying the maybeError
        // like with circular references for example.
        return new Error(String(maybeError));
    }
}
/** Get the error message string from an unknown type. */
export function getErrorMsg(error) {
    return toErrorWithMsg(error).message;
}
//# sourceMappingURL=get-error-message.js.map