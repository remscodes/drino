import type { ProgressConfig, RetryConfig } from '../../features';
import type { AbortTools } from '../../features/abort/models/abort.model';
import type { Interceptors } from '../../features/interceptors/models/interceptor.model';
import type { HeadersType, QueryParamsType, Url } from '../../models/http.model';
import type { DeepRequired } from '../../models/shared.model';

export interface RequestConfig<
  Read extends ReadType = 'object',
  Wrapper extends WrapperType = 'none'
> {
  /**
   * Prefix URL.
   *
   * Example : 'https://example.com' OR '/v1/api'
   */
  prefix?: Exclude<Url, URL>;
  /**
   * HTTP Headers.
   */
  headers?: HeadersType;
  /**
   * HTTP Parameters.
   */
  queryParams?: QueryParamsType;
  /**
   * Response type that will be passed into :
   *  - result() callback when using Observer.
   *  - then() callback when using Promise.
   *
   * If 'auto' is specified, read will be infered from "content-type" response header.
   *
   * @default 'object'
   */
  read?: Read;
  /**
   * Wrap response body into a specific Object.
   *
   * - 'response' : HttpResponse
   * - 'none' : no wrapper
   *
   * @default 'none'
   */
  wrapper?: Wrapper;
  /**
   * AbortSignal to cancel HTTP Request with an AbortController.
   */
  signal?: AbortSignal;
  /**
   * Time limit from which the request is aborted.
   *
   * @default 0 (= meaning disabled)
   */
  timeoutMs?: number;
  /**
   * Retry a failed request a certain number of times on a specific http status.
   */
  retry?: Omit<RetryConfig, 'onMethods'>;
  /**
   * Config to inspect download progress.
   */
  progress?: ProgressConfig;
}

export type ReadType =
  | 'object'
  | 'string'
  | 'none'
  | 'blob'
  | 'arrayBuffer'
  | 'formData'
  | 'auto'

export type WrapperType =
  | 'none'
  | 'response'

export interface RequestControllerConfig extends Required<Omit<RequestConfig<any, any>, 'headers' | 'queryParams' | 'timeoutMs' | 'retry' | 'signal' | 'progress'>> {
  baseUrl: URL;
  headers: Headers;
  queryParams: URLSearchParams;
  interceptors: Interceptors;
  retry: Required<RetryConfig>;
  progress: DeepRequired<ProgressConfig>;
  abortTools: AbortTools;
}
