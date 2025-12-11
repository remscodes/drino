import { Observer } from '../../../request/models/request-controller.model';
import { createPipeFromObserver, PipeFunction } from '../pipe-function';

/**
 * Executes a callback when the request is aborted
 * @example
 * request.pipe(
 *   onAbort(reason => console.log('Request aborted:', reason))
 * )
 */
export function onAbort<T>(cb: Observer<T>['abort']): PipeFunction<T, T> {
  return createPipeFromObserver({ abort: cb });
}
