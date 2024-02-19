export class AbortError extends Error {
    name;
    originalError;
    constructor(message) {
        super();
        if (message instanceof Error) {
            this.originalError = message;
            ({ message } = message);
        }
        else {
            this.originalError = new Error(message);
            this.originalError.stack = this.stack;
        }
        this.name = 'AbortError';
        this.message = message;
    }
}
//# sourceMappingURL=errors.js.map