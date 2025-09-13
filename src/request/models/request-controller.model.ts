import type { RetryEvent, StreamProgressEvent } from '../../features';
import type { Interceptors } from '../../features/interceptors/models/interceptor.model';
import type { InstanceRetryConfig } from '../../features/retry/models/retry-config.model';
import type { HttpResponse } from '../../response';
import type { RequestController } from '../request-controller';
import type { RequestConfig } from './request-config.model';

export interface RequestControllerConfig extends Required<Omit<RequestConfig<any, any>, 'headers' | 'queryParams' | 'timeout' | 'retry' | 'signal' | 'progress'>> {
  baseUrl: URL;
  headers: Headers;
  queryParams: URLSearchParams;
  interceptors: Interceptors;
  retry: Required<InstanceRetryConfig>;
  abortCtrl: AbortController;
}

export type ObjectBody<T> = Exclude<Extract<T, object>, Blob | ArrayBuffer | FormData | HttpResponse<any>>
export type StringBody<T> = Extract<T, string>
export type VoidBody<T> = Extract<T, void>
export type BlobBody<T> = Extract<T, Blob>
export type ArrayBufferBody<T> = Extract<T, ArrayBuffer>
export type FormDataBody<T> = Extract<T, FormData>

export type Modifier<I, O> = (res: I) => O

export type CheckCallback<T> = (res: T) => void
export type ReportCallback = (err: any) => void
export type FinalCallback = () => void
export type FollowCallback<A, B> = (res: A) => RequestController<B>

export interface Observer<T> {
  result?: (res: T) => void
  error?:  (err: any) => void;
  finish?: () => void;
  abort?: (reason: any) => void;
  retry?:  (ev: RetryEvent) => void;
  download?: (ev: StreamProgressEvent) => void;
  // upload?: (ev: StreamProgressEvent) => void;
}
