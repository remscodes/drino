import { Mapper } from '../../../request/models/request-controller.model';
import { Pipeline } from '../models/pipeline.model';
import { pipeToMap } from '../pipe-function';

/**
 * Maps the result of the request to a new value
 * @example
 * request.pipe(
 *   mapResult(user => user.name)
 * )
 */
export function mapResult<T1, T2>(mapper: Mapper<T1, T2>): Pipeline<T1, T2> {
  return pipeToMap(mapper);
}
