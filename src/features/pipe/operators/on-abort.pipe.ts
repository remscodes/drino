import { Observer } from '../../../request/models/request-controller.model';
import { Pipeline } from '../models/operator.model';
import { pipeFromObserver } from '../pipe-function';

/**
 * Executes a callback when the request is aborted
 * @example
 * request.pipe(
 *   onAbort(reason => console.log('Request aborted:', reason))
 * )
 */
export function onAbort<T>(cb: Observer<T>['abort']): Pipeline<T, T> {
  return pipeFromObserver({ abort: cb });
}
