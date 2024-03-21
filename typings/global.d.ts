declare global {

  interface AbortSignal {
    hasTimeout?: boolean;
    abortedByTimeout?: boolean;
  }

  interface RequestInit {
    duplex?: 'half';
  }
}

export {};
