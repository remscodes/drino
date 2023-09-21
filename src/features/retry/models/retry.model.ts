import type { NumberRange } from '../../../models/shared.model';
import type { RetryController } from '../retry-controller';

export interface RetryConfig {
  /**
   * @default 0
   */
  count: number;
  /**
   * @default [400 - 599]
   */
  onStatusCodes?: OnStatusCodes;
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
