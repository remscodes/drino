import { Observer } from '../../../request/models/request-controller.model';
import { Pipeline } from '../models/operator.model';
import { pipeFromObserver } from '../pipe-function';

/**
 * Executes a callback on download progress events
 * @example
 * request.pipe(
 *   onDownload(event => console.log('Progress:', event.progress))
 * )
 */
export function onDownload<T>(cb: Observer<T>['download']): Pipeline<T, T> {
  return pipeFromObserver({ download: cb });
}
