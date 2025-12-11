import { Observer } from '../../../request/models/request-controller.model';
import { createPipeFromObserver, PipeFunction } from '../pipe-function';

/**
 * Executes a callback on download progress events
 * @example
 * request.pipe(
 *   onDownload(event => console.log('Progress:', event.progress))
 * )
 */
export function onDownload<T>(cb: Observer<T>['download']): PipeFunction<T, T> {
  return createPipeFromObserver({ download: cb });
}
