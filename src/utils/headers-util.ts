import type { HeadersType } from '../models';
import { dateToMs, now } from './date-util';
import { mergeMapsLike } from './map-util';

export function mergeHeaders(...manyHeaders: HeadersType[]): Headers {
  return mergeMapsLike(Headers, ...manyHeaders);
}

export function inferContentType(body: unknown): string {
  return (body instanceof FormData) ? 'multipart/form-data'
    : (body instanceof URLSearchParams) ? 'application/x-www-form-urlencoded'
      : (body instanceof Blob) ? 'application/octet-stream'
        : (typeof body === 'string') ? 'text/plain'
          : 'application/json';
}

export function getRetryAfter(headers: Headers): number {
  const retryAfter: string | null = headers.get('retry-after');
  if (!retryAfter) return 0;
  if (/^(\d*[.,])?\d+$/.test(retryAfter)) return parseFloat(retryAfter) * 1000;

  const delay: number = dateToMs(retryAfter) - now();
  return (delay > 0) ? delay : 0;
}
