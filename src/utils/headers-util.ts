import type { HeadersType } from '../models';
import { dateToMs, now } from './date-util';
import { mergeMapsLike } from './map-util';

export function mergeHeaders(...manyHeaders: HeadersType[]): Headers {
  return mergeMapsLike(Headers, ...manyHeaders);
}

export function inferContentType(body: unknown): string | null {
  return (body instanceof FormData) ? 'multipart/form-data'
    : (body instanceof URLSearchParams) ? 'application/x-www-form-urlencoded'
      : (body instanceof Blob) ? 'application/octet-stream'
        : (typeof body === 'string') ? 'text/plain'
          : (typeof body === 'object') ? 'application/json'
            : null;
}

export function getRetryAfter(headers: Headers): number {
  const retryAfter: string | null = headers.get('retry-after');
  if (!retryAfter) return 0;
  if (/^(\d*[.,])?\d+$/.test(retryAfter)) return parseFloat(retryAfter) * 1000;

  const delay: number = dateToMs(retryAfter) - now();
  return (delay > 0) ? delay : 0;
}

export function isJsonContentType(headers: Headers): boolean {
  const contentType: string | null = getContentType(headers);
  if (!contentType) return false;

  return contentType.includes('application/json');
}

export function getContentType(headers: Headers): string | null {
  return headers.get('content-type');
}

export function setContentType(headers: Headers, value: string): void {
  headers.set('content-type', value);
}

export function getContentLength(headers: Headers): number | null {
  const contentLength: string | null = headers.get('content-length');
  if (!contentLength) return null;

  return parseInt(contentLength, 10);
}
