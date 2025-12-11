import { Observer } from '../../../request/models/request-controller.model';
import { createPipeFromObserver, PipeFunction } from '../pipe-function';

/**
 * Executes a callback when a retry occurs
 * @example
 * request.pipe(
 *   onRetry(event => console.log('Retry attempt', event))
 * )
 */
export function onRetry<T>(cb: Observer<T>['retry']): PipeFunction<T, T> {
  return createPipeFromObserver({ retry: cb });
}
