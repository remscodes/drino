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
  readonly abort: (reason?: any) => void;
  /**
   * Current retry delay.
   */
  readonly delay: number;
}
