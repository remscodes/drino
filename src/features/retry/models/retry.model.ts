import type { RequestMethodType } from '../../../models/http.model';
import type { NumberRange } from '../../../models/shared.model';

export interface RetryConfig {
  /**
   * Maximum retries to do on failed request.
   *
   * @default 0
   */
  max?: number;
  /**
   * Use the "Retry-After" response Header to know how much time it waits before retry.
   *
   * @default true
   */
  withRetryAfter?: boolean;
  /**
   * Specify the time in millisecond to wait before retry.
   *
   * Work only if `withRetryAfter` is `false` or if "Retry-After" response header is not present.
   *
   * @default 0
   */
  withDelayMs?: number;
  /**
   * HTTP response status code to filter which request should be retried on failure.
   *
   * @default [408, 429, 503, 504]
   */
  onStatus?: OnStatusCodes;
  /**
   * Http method to filter which request should be retried on failure.
   *
   * Can only be used for instance configuration.
   *
   * "*" means all methods.
   *
   * Example: ["GET", "POST"]
   *
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
  /**
   * Current retry delay.
   */
  delay: number;
}

type RetryAbortFn = (reason?: any) => void;
