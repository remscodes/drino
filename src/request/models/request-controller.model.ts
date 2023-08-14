import type { DrinoResponse } from '../../response';
import type { RequestController } from '../request-controller';
import type { ReadType, ReadTypeMap } from './request-config.model';

export type ResponseRequestController<T> = RequestController<DrinoResponse<T>>
export type BlobRequestController<T> = RequestController<Extract<T, Blob>>
export type ArrayBufferRequestController<T> = RequestController<Extract<T, ArrayBuffer>>
export type FormDataRequestController<T> = RequestController<Extract<T, FormData>>
export type StringRequestController<T> = RequestController<Extract<T, string>>
export type ObjectRequestController<T> = RequestController<Exclude<Extract<T, object>, Blob | ArrayBuffer | FormData | DrinoResponse<any>>>
export type AnyRequestController = RequestController<any>

export interface RequestProcessResult<Resource, Read extends ReadType> {
  ok: boolean;
  result: ReadTypeMap<Resource>[Read];
}

export interface Observer<T = any> {
  result?: (result: T) => void;
  error?: (error: any) => void;
  finish?: () => void;

  // uploadProgress?: () => void;
  // downloadProgress?: () => void;
  //
  // info?: (result: any) => void;
  // success?: (result: T) => void;
  // redirect?: (result: any) => void;
  // clientError?: (error: any) => void;
  // serverError?: (error: any) => void;
  //
  // unavailable?: (error: any) => void;
  //
  // retry?: (args: RetryArgs) => void;
  abort?: (reason: string) => void;
}

export type Modifier<A = any, B = any> = (value: A) => B;
export type CheckCallback<T> = (result: T) => void
