import type { HeadersType } from '../models/http.model';

export function mergeHeaders(...manyHeaders: HeadersType[]): Headers {
  return manyHeaders.reduce((finalHeaders: Headers, headers: HeadersType) => {
    new Headers(headers).forEach((value: string, key: string) => finalHeaders.set(key, value));
    return finalHeaders;
  }, new Headers());
}

export function inferBodyContentType(body: unknown, headers: Headers): void {
  headers.set('Content-Type', 'application/json');
}
