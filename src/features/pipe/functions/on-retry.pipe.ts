import { createPipeFromObserver, PipeFunction } from '../pipe-function';
import type { RetryEvent } from '../../retry';

/**
 * Executes a callback when a retry occurs
 * @example
 * request.pipe(
 *   onRetry(event => console.log('Retry attempt', event))
 * )
 */
export function onRetry<T>(callback: (event: RetryEvent) => void): PipeFunction<T, T> {
  return createPipeFromObserver<T, T>({
    retry: callback
  });
}
