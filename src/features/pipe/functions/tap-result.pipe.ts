import { Observer } from '../../../request/models/request-controller.model';
import { createPipeFromObserver, PipeFunction } from '../pipe-function';

/**
 * Performs a side effect on the result without modifying it
 * Similar to RxJS tap operator
 * @example
 * request.pipe(
 *   tapResult(user => console.log('User loaded:', user))
 * )
 */
export function tapResult<T>(cb: Observer<T>['result']): PipeFunction<T, T> {
  return createPipeFromObserver({ result: cb });
}
