import type { RetryEvent, StreamProgressEvent } from '../../features';
import type { Interceptors } from '../../features/interceptors/models/interceptor.model';
import type { InstanceRetryConfig } from '../../features/retry/models/retry-config.model';
import type { Promisable } from '../../models/shared.model';
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

export type Mapper<T1, T2> = (res: T1) => Promisable<T2>
export type FollowCallback<T1, T2> = (res: T1) => RequestController<T2>

export interface Observer<T = any> {
  result?: (res: T) => void;
  error?: (err: any) => void;
  finish?: () => void;
  abort?: (reason: any) => void;
  retry?: (ev: RetryEvent) => void;
  download?: (ev: StreamProgressEvent) => void;
  // upload?: (ev: StreamProgressEvent) => void;
}

export interface ObserverChain<T1, T2> extends Observer<T1> {
  result?: Mapper<T1, T2>;
}
