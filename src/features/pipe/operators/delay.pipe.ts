import { sleep } from '../../../utils/promise-util';
import { Pipeline } from '../models/pipeline.model';
import { pipeToMap } from '../pipe-function';

/**
 * Delays the emission of the result by a specified amount of time
 * @param ms - The delay duration in milliseconds
 * @example
 * request.pipe(
 *   delay(1_000) // Delays the result by 1 second
 * )
 */
export function delay<T>(ms: number): Pipeline<T> {
  return pipeToMap(async (res: T) => {
    await sleep(ms);
    return res;
  });
}
