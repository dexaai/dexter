export namespace Models {
  /** Token counts for model request. */
  export type TokenCounts = {
    prompt: number;
    completion: number;
    total: number;
  };

  /** Context object passed to hooks for logging and debugging. */
  export type Context = Record<string, any>;
}
