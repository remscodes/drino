export interface RetryEvent {
  /**
   * Current retry count.
   */
  readonly count: number;
  /**
   * Error which causes the retry.
   */
  readonly error: any;
  /**
   * Function to abort retrying.
   */
  readonly abort: RetryAbortFn;
  /**
   * Current retry delay.
   */
  readonly delay: number;
}

type RetryAbortFn = (reason?: any) => void;
