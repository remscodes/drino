import { Observer } from '../../../request/models/request-controller.model';
import { Pipeline } from '../models/pipeline.model';
import { pipeToObserve } from '../pipe-function';

/**
 * Executes a callback on download progress events
 * @example
 * request.pipe(
 *   onDownload(event => console.log('Progress:', event.progress))
 * )
 */
export function onDownload<T>(downloadCb: Observer<T>['download']): Pipeline<T> {
  return pipeToObserve({ download: downloadCb });
}
