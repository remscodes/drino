import { createPipeFromObserver, PipeFunction } from '../pipe-function';

/**
 * Intercepts and reports errors without modifying the error flow
 * Similar to RxJS tap operator for errors
 * @example
 * request.pipe(
 *   reportError(err => console.error('Request failed:', err))
 * )
 */
export function reportError<T>(callback: (error: any) => void): PipeFunction<T, T> {
  return createPipeFromObserver<T, T>({
    error: (err) => {
      callback(err);
    }
  });
}
