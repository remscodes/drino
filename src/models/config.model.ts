import { DrinoResponse } from '../drino-response';

export interface Config<Read extends ReadType = 'json'> {
  prefix?: string;

  headers?: Headers | Record<string, string>;
  queryParams?: Record<string, string> | URLSearchParams;

  /**
   * @default "json"
   */
  read?: Read;

  withCredentials?: boolean;
  signal?: AbortSignal;
  timeout?: number;
  retry?: RetryConfig;
}

export interface RetryConfig {
  count: number;
  forStatusCode: number[];
}

export interface ReadTypeMap<Data = any> {
  response: DrinoResponse<Data>;
  json: Extract<Data, object>;
  text: Extract<Data, string>;
  blob: Extract<Data, Blob>;
  arrayBuffer: Extract<Data, ArrayBuffer>;
  formData: Extract<Data, FormData>;
}

export type ReadType = keyof ReadTypeMap

export type InferReadType<Data>
  = Data extends DrinoResponse<Data> ? 'response'
  : Data extends Blob ? 'blob'
    : Data extends ArrayBuffer ? 'arrayBuffer'
      : Data extends FormData ? 'formData'
        : Data extends string ? 'text'
          : Data extends object ? 'json'
            : never
