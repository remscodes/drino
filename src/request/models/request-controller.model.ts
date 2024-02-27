import type { RetryEvent, StreamProgressEvent } from '../../features';
import type { Interceptors } from '../../features/interceptors/models/interceptor.model';
import type { ProgressConfig } from '../../features/progress/models/progress-config.model';
import type { InstanceRetryConfig } from '../../features/retry/models/retry-config.model';
import type { DeepRequired } from '../../models/shared.model';
import type { HttpResponse } from '../../response';
import type { RequestController } from '../request-controller';
import type { RequestConfig } from './request-config.model';

export interface RequestControllerConfig extends Required<Omit<RequestConfig<any, any>, 'headers' | 'queryParams' | 'timeoutMs' | 'retry' | 'signal' | 'progress'>> {
  baseUrl: URL;
  headers: Headers;
  queryParams: URLSearchParams;
  interceptors: Interceptors;
  retry: Required<InstanceRetryConfig>;
  progress: DeepRequired<ProgressConfig>;
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
  result?: ResultCallback<T>;
  error?: ErrorCallback;
  finish?: FinishCallback;
  abort?: AbortCallback;
  retry?: RetryCallback;
  downloadProgress?: DownloadCallback;
  // uploadProgress?: UploadCallback;
}

type ResultCallback<T> = (res: T) => void
type ErrorCallback = (err: any) => void
type FinishCallback = () => void
type AbortCallback = (reason: any) => void
type RetryCallback = (ev: RetryEvent) => void
type DownloadCallback = (ev: StreamProgressEvent) => void
// type UploadCallback = DownloadCallback
