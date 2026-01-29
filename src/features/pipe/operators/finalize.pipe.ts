import { Observer } from '../../../request/models/request-controller.model';
import { Pipeline } from '../models/pipeline.model';
import { pipeToObserve } from '../pipe-function';

/**
 * Executes a callback when the request finishes (success or error)
 * @example
 * request.pipe(
 *   finalize(() => console.log('Request completed'))
 * )
 */
export function finalize<T>(cb: Observer<T>['finish']): Pipeline<T> {
  return pipeToObserve({ finish: cb });
}
