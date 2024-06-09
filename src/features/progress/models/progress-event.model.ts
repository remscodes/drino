export interface StreamProgressEvent {
  /**
   * Total bytes to be received or to be sent;
   */
  readonly total: number;
  /**
   * Total bytes received or sent.
   */
  readonly loaded: number;
  /**
   * Current percentage received or sent.
   * Between 0 and 1.
   */
  readonly percent: number;
  /**
   * Current speed in bytes/ms.
   * Equals to 0 for the first `iteration`.
   */
  readonly speed: number;
  /**
   * Estimated remaining time in **milliseconds** to complete the progress.
   * Equals to 0 for the first `iteration`.
   */
  readonly remainingTime: number;
  /**
   * Current chunk received or sent.
   */
  readonly chunk: Uint8Array;
  /**
   * Current iteration number of the progress.
   */
  readonly iteration: number;
}
