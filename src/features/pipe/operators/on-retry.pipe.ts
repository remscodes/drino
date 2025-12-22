import { Observer } from '../../../request/models/request-controller.model';
import { Pipeline } from '../models/operator.model';
import { pipeFromObserver } from '../pipe-function';

/**
 * Executes a callback when a retry occurs
 * @example
 * request.pipe(
 *   onRetry(event => console.log('Retry attempt', event))
 * )
 */
export function onRetry<T>(cb: Observer<T>['retry']): Pipeline<T, T> {
  return pipeFromObserver({ retry: cb });
}
