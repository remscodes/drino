import type { RetryConfig } from '../features';
import type { DrinoResponse } from '../response';

export interface Config<Read extends ReadType> {
  prefix?: string;

  headers?: Headers | Record<string, string>;
  queryParams?: Record<string, string> | URLSearchParams;

  read?: Read;

  withCredentials?: boolean;
  signal?: AbortSignal;
  timeout?: number;
  retry?: RetryConfig;
}

export interface ReadTypeMap<Data = any> {
  response: DrinoResponse<Data>;
  object: Extract<Data, object>;
  string: Extract<Data, string>;
  blob: Extract<Data, Blob>;
  arrayBuffer: Extract<Data, ArrayBuffer>;
  formData: Extract<Data, FormData>;
  none: Extract<Data, void>;
}

export type ReadType<T = any> = keyof ReadTypeMap<T>

export type InferReadType<Data>
  = Data extends DrinoResponse<Data> ? 'response'
  : Data extends Blob ? 'blob'
    : Data extends ArrayBuffer ? 'arrayBuffer'
      : Data extends FormData ? 'formData'
        : Data extends string ? 'string'
          : Data extends object ? 'object'
            : never
