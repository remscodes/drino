import { createPipeFromModifier, PipeFunction } from '../pipe-function';

/**
 * Delays the emission of the result by a specified amount of time
 * Similar to RxJS delay operator
 * @param ms - The delay duration in milliseconds
 * @example
 * request.pipe(
 *   delay(1000) // Delays result by 1 second
 * )
 */
export function delay<T>(ms: number): PipeFunction<T, T> {
  return createPipeFromModifier(async (val: T) => {
    await new Promise(resolve => setTimeout(resolve, ms));
    return val;
  });
}
