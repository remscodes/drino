import { Observer } from '../../../request/models/request-controller.model';
import { createPipeFromObserver, PipeFunction } from '../pipe-function';

/**
 * Executes a callback when the request finishes (success or error)
 * Similar to RxJS finalize operator
 * @example
 * request.pipe(
 *   finalize(() => console.log('Request completed'))
 * )
 */
export function finalize<T>(cb: Observer<T>['finish']): PipeFunction<T, T> {
  return createPipeFromObserver({ finish: cb });
}
