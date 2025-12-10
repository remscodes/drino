import { createPipeFromModifier, PipeFunction } from '../pipe-function';

/**
 * Maps the result of the request to a new value
 * Similar to RxJS map operator
 * @example
 * request.pipe(
 *   mapResult(user => user.name)
 * )
 */
export function mapResult<T1, T2>(mapper: (val: T1) => T2): PipeFunction<T1, T2> {
  return createPipeFromModifier(mapper);
}
