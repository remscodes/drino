import type { RequestMethodType } from '../../../models/http.model';
import type { NumberRange } from '../../../models/shared.model';
import type { RetryController } from '../retry-controller';

export interface RetryConfig {
  /**
   * Max retry to do on failed request.
   * @default 0
   */
  max: number;
  /**
   * If "Retry-After" response header is not present.
   * @default 100ms
   */
  retryAfterMs?: number;
  /**
   * Use the "Retry-After" response Header to know
   * @default true
   */
  useRetryAfterHeader?: boolean;
  /**
   * @default { min: 400, max: 599 }
   */
  onStatusCodes?: OnStatusCodes;
  /**
   * @default ["*"]
   */
  onMethods?: (RequestMethodType | '*')[];
}

export type OnStatusCodes =
  | number[]
  | NumberRange
  | NumberRange[]

export interface RetryArgs {
  count: number;
  error: any;
  rc: RetryController;
}
