declare global {

  interface AbortSignal {
    hasTimeout?: boolean;
    timeout?: boolean;
  }

  interface RequestInit {
    duplex?: 'half';
  }
}

export {};
