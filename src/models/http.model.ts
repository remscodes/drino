import type { HttpResponse } from '../response';
import type { Prefix } from './shared.model';

export type RequestMethodType =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  // | 'CONNECT'
  | 'OPTIONS'
  // | 'TRACE'
  | 'PATCH';

export type Url =
  | Prefix<string, `http${'s' | ''}://`>
  | Prefix<string, '/'>
  | URL

export type StatusType =
  | StatusSuccessType
  | StatusErrorType

type StatusSuccessType =
  | 'Info'
  | 'Success'
  | 'Redirection'

type StatusErrorType =
  | 'ClientError'
  | 'ServerError'

export type FetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export type UnwrapHttpResponse<T>
  = T extends HttpResponse<infer F> ? F
  : T
