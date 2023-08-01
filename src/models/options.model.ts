export interface Options {
  prefix?: string;

  headers?: Record<string, string>;
  params?: Record<string, string | number>;

  signal?: AbortSignal;
  timeout?: number;
}
