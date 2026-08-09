import { FollowCallback } from '../../../request/models/request-controller.model';
import { Pipeline } from '../models/pipeline.model';
import { pipeToMap } from '../pipe-function';

/**
 * Chains another request after the current one completes
 * The result of the first request is passed to the callback which returns a new RequestController
 * @example
 * // Get user details then fetch their posts
 * drino.get<User>('/api/users/123')
 *   .pipe(
 *     follow(user => drino.get<Post[]>(`/api/users/${user.id}/posts`))
 *   )
 *   .consume();
 */
export function follow<T1, T2>(followCb: FollowCallback<T1, T2>): Pipeline<T1, T2> {
  return pipeToMap((result: T1) => followCb(result).consume());
}
