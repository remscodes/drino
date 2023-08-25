import type { HeadersType } from '../models/http.model';

export function mergeHeaders(...manyHeaders: HeadersType[]): Headers {
  return manyHeaders.reduce((finalHeaders: Headers, headers: HeadersType) => {
    new Headers(headers).forEach((value: string, key: string) => finalHeaders.set(key, value));
    return finalHeaders;
  }, new Headers());
}

export function inferBodyContentType(body: unknown, headers: Headers): void {
  const value: string
    = (body instanceof FormData) ? 'multipart/form-data'
    : (body instanceof Blob) ? 'application/octet-stream'
      : (typeof body === 'string') ? 'text/plain'
        : 'application/json';

  headers.set('Content-Type', value);
}
