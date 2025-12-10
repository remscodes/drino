import { createPipeFromObserver, PipeFunction } from '../pipe-function';
import type { StreamProgressEvent } from '../../progress/models/progress-event.model';

/**
 * Executes a callback on download progress events
 * @example
 * request.pipe(
 *   onDownload(event => console.log('Progress:', event.progress))
 * )
 */
export function onDownload<T>(callback: (event: StreamProgressEvent) => void): PipeFunction<T, T> {
  return createPipeFromObserver<T, T>({
    download: callback
  });
}
