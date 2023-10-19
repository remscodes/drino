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
   * Current percentage received or sent.
   */
  // readonly percent: number;
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
  // speed: number;
  /**
   * Estimated time in milliseconds to complete the progress.
   */
  // estimatedMs: number;
}
