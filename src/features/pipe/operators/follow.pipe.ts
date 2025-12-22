import { RequestController } from '../../../request';
import { FollowCallback } from '../../../request/models/request-controller.model';
import { Pipeline } from '../models/operator.model';

/**
 * Chains another request after the current one completes
 * The result of the first request is passed to the callback which returns a new RequestController
 * Similar to RxJS flatMap operator
 * @example
 * // Get user details then fetch their posts
 * drino.get<User>('/api/user/123')
 *   .pipe(
 *     follow(user => drino.get<Post[]>(`/api/users/${user.id}/posts`))
 *   )
 *   .consume();
 */
export function follow<T1, T2>(cb: FollowCallback<T1, T2>): Pipeline<T1, T2> {
  return (source: RequestController<T1>) => {
    return source.addMapper((result: T1) => cb(result).consume()) as unknown as RequestController<T2>;
  };
}
