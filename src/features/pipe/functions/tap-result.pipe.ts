import { createPipeFromObserver, PipeFunction } from '../pipe-function';

/**
 * Performs a side effect on the result without modifying it
 * Similar to RxJS tap operator
 * @example
 * request.pipe(
 *   tapResult(user => console.log('User loaded:', user))
 * )
 */
export function tapResult<T>(callback: (result: T) => void): PipeFunction<T, T> {
  return createPipeFromObserver<T, T>({
    result: (res) => {
      callback(res);
    }
  });
}
