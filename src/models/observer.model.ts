import { RetryController } from '../lifecycle/retry-controller';

export interface Observer<T = any> {
  result?: (result: T) => void;
  error?: (error: any) => void;
  finish?: (ms: number) => void;

  info?: (result: any) => void;
  success?: (result: T) => void;
  redirect?: (result: any) => void;
  clientError?: (error: any) => void;
  serverError?: (error: any) => void;

  retry?: (args: RetryArgs) => void;
  abort?: (reason: any) => void;
}

interface RetryArgs {
  count: number;
  error: any;
  rc: RetryController;
}
