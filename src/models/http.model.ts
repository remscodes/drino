import type { HttpResponse } from '../response';
import type { PlainObject } from './shared.model';

export type RequestMethodType =
  | 'GET'
  | 'HEAD'
  | 'DELETE'
  | 'OPTIONS'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  // | 'CONNECT'
  // | 'TRACE'

export type HeadersType =
  | Headers
  | PlainObject

export type QueryParamsType =
  | URLSearchParams
  | PlainObject

export type Url =
  | URL
  | string

export type UnwrapHttpResponse<T>
  = T extends HttpResponse<infer F> ? F
  : T
