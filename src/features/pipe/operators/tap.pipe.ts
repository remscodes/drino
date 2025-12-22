import { Observer } from '../../../request/models/request-controller.model';
import { Pipeline } from '../models/operator.model';
import { pipeFromObserver } from '../pipe-function';

/**
 * Performs side effects using an Observer without modifying the result
 * Similar to RxJS tap operator but accepts a complete Observer object
 * @example
 * request.pipe(
 *   tap({
 *     result: user => console.log('User loaded:', user),
 *     error: err => console.error('Failed:', err),
 *     finish: () => console.log('Request complete')
 *   })
 * )
 */
export function tap<T>(observer: Observer<T>): Pipeline<T, T> {
  return pipeFromObserver(observer);
}
