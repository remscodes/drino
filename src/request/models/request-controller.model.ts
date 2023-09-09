import type { HttpResponse } from '../../response';

export type ObjectBody<T> = Exclude<Extract<T, object>, Blob | ArrayBuffer | FormData | HttpResponse<any>>
export type StringBody<T> = Extract<T, string>
export type VoidBody<T> = Extract<T, void>
export type BlobBody<T> = Extract<T, Blob>
export type ArrayBufferBody<T> = Extract<T, ArrayBuffer>
export type FormDataBody<T> = Extract<T, FormData>

export type Modifier<I = any, O = any> = (value: I) => O;
export type CheckCallback<T> = (result: T) => void
export type ReportCallback = (error: any) => void
export type FinalCallback = () => void

export interface Observer<T> {
  result?: (result: T) => void;
  error?: (error: any) => void;
  finish?: () => void;
  // retry?: (args: RetryArgs) => void;
  abort?: (reason: any) => void;
}
