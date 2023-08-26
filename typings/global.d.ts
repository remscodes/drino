declare global {

  interface AbortSignal {
    hasTimeout?: boolean;
    abortedByTimeout?: boolean;
  }
}

export {};
