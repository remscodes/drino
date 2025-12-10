import { createPipeFromObserver, PipeFunction } from '../pipe-function';

/**
 * Executes a callback when the request finishes (success or error)
 * Similar to RxJS finalize operator
 * @example
 * request.pipe(
 *   finalize(() => console.log('Request completed'))
 * )
 */
export function finalize<T>(callback: () => void): PipeFunction<T, T> {
  return createPipeFromObserver<T, T>({
    finish: callback
  });
}
