import { Observer } from '../../../request/models/request-controller.model';
import { Pipeline } from '../models/operator.model';
import { pipeFromObserver } from '../pipe-function';

/**
 * Intercepts and reports errors without modifying the error flow
 * Similar to RxJS tap operator for errors
 * @example
 * request.pipe(
 *   reportError(err => console.error('Request failed:', err))
 * )
 */
export function reportError<T>(cb: Observer<T>['error']): Pipeline<T, T> {
  return pipeFromObserver({ error: cb });
}
