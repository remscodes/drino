import type { RequestMethodType } from '../../../models/http.model';
import type { RetryController } from '../retry-controller';

export interface RetryConfig {
  count: number;
  forStatusCode: number[];
  forMethod: RequestMethodType[];
}

export interface RetryArgs {
  count: number;
  error: any;
  rc: RetryController;
}
