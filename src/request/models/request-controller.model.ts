import type { StreamProgressEvent, ProgressConfig, RetryEvent, RetryConfig } from '../../features';
import type { AbortTools } from '../../features/abort/models/abort.model';
import type { Interceptors } from '../../features/interceptors/models/interceptor.model';
import type { DeepRequired } from '../../models/shared.model';
import type { HttpResponse } from '../../response';
import type { RequestController } from '../request-controller';
import type { RequestConfig } from './request-config.model';

export interface RequestControllerConfig extends Required<Omit<RequestConfig<any, any>, 'headers' | 'queryParams' | 'timeoutMs' | 'retry' | 'signal' | 'progress'>> {
  baseUrl: URL;
  headers: Headers;
  queryParams: URLSearchParams;
  interceptors: Interceptors;
  retry: Required<RetryConfig>;
  progress: DeepRequired<ProgressConfig>;
  abortTools: AbortTools;
}

export type ObjectBody<T> = Exclude<Extract<T, object>, Blob | ArrayBuffer | FormData | HttpResponse<any>>
export type StringBody<T> = Extract<T, string>
export type VoidBody<T> = Extract<T, void>
export type BlobBody<T> = Extract<T, Blob>
export type ArrayBufferBody<T> = Extract<T, ArrayBuffer>
export type FormDataBody<T> = Extract<T, FormData>

export type Modifier<I, O> = (value: I) => O

export type CheckCallback<T> = (result: T) => void
export type ReportCallback = (error: any) => void
export type FinalCallback = () => void
export type FollowCallback<A, B> = (result: A) => RequestController<B>

export interface Observer<T> {
  result?: (result: T) => void;
  error?: (error: any) => void;
  finish?: () => void;
  abort?: (reason: any) => void;
  retry?: (args: RetryEvent) => void;
  downloadProgress?: (event: StreamProgressEvent) => void;
  // uploadProgress?: (event: DrinoProgressEvent) => void;
}
