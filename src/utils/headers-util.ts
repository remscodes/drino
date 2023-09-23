import type { HeadersType } from '../models/http.model';
import { mergeMapsLike } from './map-util';

export function mergeHeaders(...manyHeaders: HeadersType[]): Headers {
  return mergeMapsLike(Headers, ...manyHeaders);
}

export function inferContentType(body: unknown): string {
  return (body instanceof FormData) ? 'multipart/form-data'
    : (body instanceof Blob) ? 'application/octet-stream'
      : (typeof body === 'string') ? 'text/plain'
        : 'application/json';
}
