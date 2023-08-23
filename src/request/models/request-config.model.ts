import type { Interceptors } from '../../features/interceptors/models/interceptor.model';
import type { HeadersType, QueryParamsType, Url } from '../../models/http.model';

export interface RequestConfig<
  Read extends ReadType = 'object',
  Wrapper extends WrapperType = 'none'
> {
  /**
   * Prefix URL.
   *
   * Example : 'https://example.com' OR '/api'
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
   * If 'auto' is specified, read will be deducted from "content-type" response header.
   *
   * @default 'object'
   */
  read?: Read;
  /**
   * Wrap response body into a specific Object.
   *
   * - 'response' : HttpResponse
   * - 'none' : nothing
   *
   * @default 'none'
   */
  wrapper?: Wrapper;
  /**
   * AbortSignal to cancel HTTP Request with an AbortController.
   */
  signal?: AbortSignal;
  /**
   * Interceptors
   */
  interceptors?: Interceptors;
  // timeoutMs?: number;
  // retry?: RetryConfig;
  // withCredentials?: boolean;
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

export interface DefinedConfig extends Required<Omit<RequestConfig<any, any>, 'headers' | 'queryParams' | 'interceptors'>> {
  baseUrl: URL;
  headers: Headers;
  queryParams: URLSearchParams;
  interceptors: Required<Interceptors>;
}
