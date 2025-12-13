import { Observer } from '../../../request/models/request-controller.model';
import { createPipeFromObserver, PipeFunction } from '../pipe-function';

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
export function tap<T>(observer: Observer<T>): PipeFunction<T, T> {
  return createPipeFromObserver(observer);
}
