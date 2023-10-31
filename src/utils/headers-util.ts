import { CONTENT_TYPE_BLOB, CONTENT_TYPE_FORM_DATA, CONTENT_TYPE_JSON, CONTENT_TYPE_STRING, CONTENT_TYPE_URL_ENCODED, HEADER_RETRY_AFTER } from '../constants/headers.contants';
import type { HeadersType } from '../models/http.model';
import type { Nullable } from '../models/shared.model';
import { dateToMs, now } from './date-util';
import { mergeMapsLike } from './map-util';

export function mergeHeaders(...manyHeaders: HeadersType[]): Headers {
  return mergeMapsLike(Headers, ...manyHeaders);
}

export function inferContentType(body: unknown): string {
  return (body instanceof FormData) ? CONTENT_TYPE_FORM_DATA
    : (body instanceof URLSearchParams) ? CONTENT_TYPE_URL_ENCODED
      : (body instanceof Blob) ? CONTENT_TYPE_BLOB
        : (typeof body === 'string') ? CONTENT_TYPE_STRING
          : CONTENT_TYPE_JSON;
}

export function getRetryAfter(headers: Headers): number {
  const retryAfter: Nullable<string> = headers.get(HEADER_RETRY_AFTER);
  if (!retryAfter) return 0;

  if (/^(\d*[.,])?\d+$/.test(retryAfter)) return parseFloat(retryAfter) * 1000;

  const delay: number = dateToMs(retryAfter) - now();
  return (delay > 0) ? delay
    : 0;
}
