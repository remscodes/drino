import type { PlainObject } from '../../models/shared.model';

export interface RequestConfig<
  Read extends ReadType = 'object',
  Wrapper extends WrapperType = 'none'
> {
  /**
   * Prefix URL.
   *
   * Example : 'https://example.com' OR '/api'
   */
  prefix?: string;
  /**
   * HTTP Headers.
   */
  headers?: Headers | PlainObject;
  /**
   * HTTP Parameters.
   */
  queryParams?: URLSearchParams | PlainObject;
  /**
   * Response type that will be passed into :
   *  - result callback when using Observer.
   *  - then callback when using Promise.
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
   *
   * See below in section "Abort Request".
   */
  signal?: AbortSignal;
  // interceptors?: any;

  // withCredentials?: boolean;
  // timeout?: number;
  // retry?: RetryConfig;
}

interface Interceptors {

}

export type WrapperType =
  | 'none'
  | 'response'

export interface ReadTypeMap<Data = any> {
  object: Extract<Data, object>;
  string: Extract<Data, string>;
  none: Extract<Data, void>;
  blob: Extract<Data, Blob>;
  arrayBuffer: Extract<Data, ArrayBuffer>;
  formData: Extract<Data, FormData>;
  auto: any;
}

export type ReadType<T = any> = keyof ReadTypeMap<T>

export type InferReadType<Data>
  = Data extends Blob ? 'blob'
  : Data extends ArrayBuffer ? 'arrayBuffer'
    : Data extends FormData ? 'formData'
      : Data extends string ? 'string'
        : Data extends object ? 'object'
          : Data extends void ? 'none'
            : never
