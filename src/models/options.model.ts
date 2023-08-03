import { DrinoResponse } from '../drino-response';

export interface Options<Read extends ReadType = 'response'> {
  prefix?: string;

  headers?: Headers | Record<string, string>;
  queryParams?: Record<string, string> | URLSearchParams;

  /**
   * @default "response"
   */
  read?: Read;

  withCredentials?: boolean;
  signal?: AbortSignal;
  timeout?: number;
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
