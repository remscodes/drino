declare global {

  interface AbortSignal {
    hasTimeout?: boolean;
    isTimeout?: boolean;
  }
}

export {};
