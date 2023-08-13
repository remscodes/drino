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
