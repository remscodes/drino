import type { RetryConfig } from '../../features/retry/models/retry-config.model';
import type { HeadersType, QueryParamsType, Url } from '../../models/http.model';

export interface RequestConfig<
  Read extends ReadType = 'auto',
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
   * @default 'auto'
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
   * Time limit in **milliseconds** from which the request is aborted.
   *
   * @default 0 (= meaning disabled)
   */
  timeout?: number;
  /**
   * Retry a failed request a certain number of times on a specific http status.
   */
  retry?: RetryConfig;
  /**
   * The `fetch` function to be used to perform request.
   *
   * @default fetch
   */
  fetch?: typeof fetch;
  /**
   * A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL.
   *
   * @default 'same-origin'
   */
  credentials?: RequestCredentials;
  /**
   * A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs.
   *
   * @default 'cors'
   */
  mode?: RequestMode;
  /**
   * The priority of the request relative to other requests.
   *
   * @default 'auto'
   */
  priority?: RequestPriority;
  /**
   * A string indicating how the request will interact with the browser's cache to set request's cache.
   *
   * @default 'default'
   */
  cache?: RequestCache;
  /**
   * A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion).
   *
   * @default 'follow'
   */
  redirect?: RequestRedirect;
  /**
   * Perform the request in the background with a body limit of 64kB.
   *
   * If enabled, the request will not be aborted when the document is unloaded.
   *
   * @default false
   */
  keepalive?: boolean;
  /**
   * A referrer policy to set request's referrerPolicy.
   *
   * @default 'strict-origin-when-cross-origin'
   */
  referrerPolicy?: ReferrerPolicy;
  /**
   * A cryptographic hash of the resource to be fetched by request.
   */
  integrity?: string;
}

export type ReadType =
  | 'auto'
  | 'object'
  | 'string'
  | 'none'
  | 'blob'
  | 'arrayBuffer'
  | 'formData'

export type WrapperType =
  | 'none'
  | 'response'
