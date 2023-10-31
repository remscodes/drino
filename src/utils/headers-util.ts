import type { HeadersType } from '../models/http.model';
import type { Nullable } from '../models/shared.model';
import { mergeMapsLike } from './map-util';
import { dateToMs, now } from './date-util';

export function mergeHeaders(...manyHeaders: HeadersType[]): Headers {
  return mergeMapsLike(Headers, ...manyHeaders);
}

export function inferContentType(body: unknown): string {
  return (body instanceof FormData) ? 'multipart/form-data'
    : (body instanceof Blob) ? 'application/octet-stream'
      : (typeof body === 'string') ? 'text/plain'
        : 'application/json';
}

export function getRetryAfter(headers: Headers): number {
  const retryAfter: Nullable<string> = headers.get('retry-after');
  if (!retryAfter) return 0;

  if (/^(\d*[.,])?\d+$/.test(retryAfter)) return parseFloat(retryAfter) * 1000;

  const delay: number = dateToMs(retryAfter) - now();
  return (delay > 0) ? delay
    : 0;
}
