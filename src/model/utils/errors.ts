export class AbortError extends Error {
  readonly name: 'AbortError';
  readonly originalError: Error;

  constructor(message: string | Error) {
    super();

    if (message instanceof Error) {
      this.originalError = message;
      ({ message } = message);
    } else {
      this.originalError = new Error(message);
      this.originalError.stack = this.stack;
    }

    this.name = 'AbortError';
    this.message = message;
  }
}

export class RefusalError extends Error {
  readonly name: 'RefusalError';
  readonly originalError: Error;

  constructor(message: string | Error) {
    super();

    if (message instanceof Error) {
      this.originalError = message;
      ({ message } = message);
    } else {
      this.originalError = new Error(message);
      this.originalError.stack = this.stack;
    }

    this.name = 'RefusalError';
    this.message = message;
  }
}

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMsg(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMsg(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMsg(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

/** Get the error message string from an unknown type. */
export function getErrorMsg(error: unknown) {
  return toErrorWithMsg(error).message;
}
