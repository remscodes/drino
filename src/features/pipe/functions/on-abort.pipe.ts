import { createPipeFromObserver, PipeFunction } from '../pipe-function';

/**
 * Executes a callback when the request is aborted
 * @example
 * request.pipe(
 *   onAbort(reason => console.log('Request aborted:', reason))
 * )
 */
export function onAbort<T>(callback: (reason: any) => void): PipeFunction<T, T> {
  return createPipeFromObserver<T, T>({
    abort: callback
  });
}
