import { DrinoResponse } from '../drino-response';
import { RetryController } from '../lifecycle/retry-controller';
import { RequestController } from '../request-controller';
import { ReadType, ReadTypeMap } from './config.model';

export type RequestControllerForResponse<T> = RequestController<DrinoResponse<T>>
export type BlobRequestController<T> = RequestController<Extract<T, Blob>>
export type ArrayBufferRequestController<T> = RequestController<Extract<T, ArrayBuffer>>
export type FormDataRequestController<T> = RequestController<Extract<T, FormData>>
export type StringRequestController<T> = RequestController<Extract<T, string>>
export type ObjectRequestController<T> = RequestController<Exclude<Extract<T, object>, Blob | ArrayBuffer | FormData>>
export type AnyRequestController = RequestController<any>

export type Modifier<A = any, B = any> = (value: A) => B;
export type CheckCallback<T> = Modifier<T, void>

export interface Observer<T = any> {
  result?: (result: T) => void;
  error?: (error: any) => void;
  finish?: (ms: number) => void;

  uploadProgress?: () => void;
  downloadProgress?: () => void;

  info?: (result: any) => void;
  success?: (result: T) => void;
  redirect?: (result: any) => void;
  clientError?: (error: any) => void;
  serverError?: (error: any) => void;

  unavailable?: (error: any) => void;

  retry?: (args: RetryArgs) => void;
  abort?: (reason: any) => void;
}

export interface RetryArgs {
  count: number;
  error: any;
  rc: RetryController;
}

export interface RequestProcessResult<Resource, Read extends ReadType> {
  ok: boolean;
  result: ReadTypeMap<Resource>[Read];
}
