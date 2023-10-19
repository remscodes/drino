import type { RetryArgs } from '../../features';
import type { HttpResponse } from '../../response';
import type { RequestController } from '../request-controller';

export type ObjectBody<T> = Exclude<Extract<T, object>, Blob | ArrayBuffer | FormData | HttpResponse<any>>
export type StringBody<T> = Extract<T, string>
export type VoidBody<T> = Extract<T, void>
export type BlobBody<T> = Extract<T, Blob>
export type ArrayBufferBody<T> = Extract<T, ArrayBuffer>
export type FormDataBody<T> = Extract<T, FormData>

export type Modifier<I, O> = (value: I) => O

export type CheckCallback<T> = (result: T) => void
export type ReportCallback = (error: any) => void
export type FinalCallback = () => void
export type FollowCallback<A, B> = (result: A) => RequestController<B>

export interface DrinoProgressEvent {
  /**
   * Total bytes to be received or to be sent;
   */
  readonly total: number;
  /**
   * Current bytes received or sent.
   */
  readonly loaded: number;
  /**
   * Current received or sent chunk.
   */
  readonly chunk: Uint8Array;
  /**
   * Current iteration number of the progress.
   */
  readonly iteration: number;
  /**
   * Current speed in Kb/s.
   */
  // rate: number;
  /**
   * Estimated time in milliseconds to complete the progress.
   */
  // estimatedMs: number;
}

export interface Observer<T> {
  result?: (result: T) => void;
  error?: (error: any) => void;
  finish?: () => void;
  abort?: (reason: any) => void;
  retry?: (args: RetryArgs) => void;
  downloadProgress?: (event: DrinoProgressEvent) => void;
  // uploadProgress?: (event: DrinoProgressEvent) => void;
}
