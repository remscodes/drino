import type { ProgressConfig } from '../../features/progress/models/progress-config.model';
import type { RetryConfig } from '../../features/retry/models/retry-config.model';
import type { HeadersType, QueryParamsType, Url } from '../../models/http.model';

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
   *  - `result` callback when using Observer.
   *  - `then` callback when using Promise.
   *
   * If 'auto' is specified, read will be inferred from "content-type" response header.
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
  retry?: RetryConfig;
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


