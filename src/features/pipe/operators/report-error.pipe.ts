import { Observer } from '../../../request/models/request-controller.model';
import { Pipeline } from '../models/pipeline.model';
import { pipeToObserve } from '../pipe-function';

/**
 * Intercepts and reports errors without modifying the error flow
 * @example
 * request.pipe(
 *   reportError(err => console.error('Request failed:', err))
 * )
 */
export function reportError<T>(cb: Observer<T>['error']): Pipeline<T> {
  return pipeToObserve({ error: cb });
}
