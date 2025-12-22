import { Pipeline } from '../models/operator.model';
import { pipeFromModifier } from '../pipe-function';

/**
 * Maps the result of the request to a new value
 * Similar to RxJS map operator
 * @example
 * request.pipe(
 *   mapResult(user => user.name)
 * )
 */
export function mapResult<T1, T2>(mapper: (res: T1) => T2): Pipeline<T1, T2> {
  return pipeFromModifier(mapper);
}
