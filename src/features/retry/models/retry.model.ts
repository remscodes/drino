import type { RequestMethodType } from '../../../models/http.model';
import type { NumberRange } from '../../../models/shared.model';

export interface RetryConfig {
  /**
   * Max retry to do on failed request.
   * @default 0
   */
  max: number;
  /**
   * Use the "Retry-After" response Header to know how much time it wait before retry.
   * @default true
   */
  useRetryAfter?: boolean;
  /**
   * Specify the time to wait before retry.
   *
   * Work only if `useRetryAfter` is `false` or if "Retry-After" response header is not present.
   * @default 0
   */
  intervalMs?: number;
  /**
   * HTTP response status code to filter which request should be retried on failure.
   * @default [408, 429, 503, 504]
   */
  onStatus?: OnStatusCodes;
  /**
   * Http method to filter which request should be retried on failure.
   * @default "*"
   */
  onMethods?: OnMethods;
}

export type OnStatusCodes =
  | number[]
  | NumberRange
  | NumberRange[]

export type OnMethods =
  | RequestMethodType[]
  | '*'

export interface RetryArgs {
  /**
   * Current retry count.
   */
  count: number;
  /**
   * Error which causes the retry.
   */
  error: any;
  /**
   * Function to abort retrying.
   */
  abort: RetryAbortFn;
}

type RetryAbortFn = (reason?: any) => void;
