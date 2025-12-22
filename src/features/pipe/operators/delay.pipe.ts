import { sleep } from '../../../utils/promise-util';
import { Pipeline } from '../models/operator.model';
import { pipeFromModifier } from '../pipe-function';

/**
 * Delays the emission of the result by a specified amount of time
 * Similar to RxJS delay operator
 * @param ms - The delay duration in milliseconds
 * @example
 * request.pipe(
 *   delay(1000) // Delays result by 1 second
 * )
 */
export function delay<T>(ms: number): Pipeline<T, T> {
  return pipeFromModifier(async (res: T) => {
    await sleep(ms);
    return res;
  });
}
