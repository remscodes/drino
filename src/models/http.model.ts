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
  | `http${string}`
  | `/${string}`
  | URL
