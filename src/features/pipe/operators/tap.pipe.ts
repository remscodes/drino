import { Observer } from '../../../request/models/request-controller.model';
import { Pipeline } from '../models/pipeline.model';
import { pipeToObserve } from '../pipe-function';

/**
 * Performs side effects using an Observer without modifying the result
 * @example
 * request.pipe(
 *   tap({
 *     result: user => console.log('User loaded:', user),
 *     error: err => console.error('Failed:', err),
 *     finish: () => console.log('Request complete')
 *   })
 * )
 */
export function tap<T>(observer: Observer<T>): Pipeline<T> {
  return pipeToObserve(observer);
}
