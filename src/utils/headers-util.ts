import type { HeadersType } from '../models/http.model';

export function mergeHeaders(...headerss: HeadersType[]): Headers {
  return headerss.reduce((finalHeaders: Headers, headers: HeadersType) => {
    new Headers(headers).forEach((value: string, key: string) => finalHeaders.set(key, value));
    return finalHeaders;
  }, new Headers());
}

export function inferBodyContentType(body: unknown, headers: Headers): void {
  headers.set('Content-Type', 'application/json');
}
