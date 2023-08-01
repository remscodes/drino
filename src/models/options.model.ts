export interface Options {
  prefix?: string;
  signal?: AbortSignal;
  timeout?: number;
  headers?: Record<string, string>;
}
