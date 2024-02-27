import { emitError } from 'thror';
import type { Nullable } from '../../models/shared.model';
import type { FetchTools } from '../../request/models/fetch-tools.model';
import { now as dateNow } from '../../utils/date-util';

export async function inspectDownloadProgress(response: Response, tools: FetchTools): Promise<void> {
  const body: Nullable<ReadableStream<Uint8Array>> = response.clone().body;
  if (!body) return;

  const reader: ReadableStreamDefaultReader<Uint8Array> = body.getReader();

  const contentLength: Nullable<string> = response.headers.get('content-length');
  if (!contentLength) emitError('DrinoProgressException', `Cannot inspect download progress on ${response.url} because response "content-length" header is null.`);

  const total: number = parseInt(contentLength, 10);

  let loaded: number = 0;
  let speed: number = 0;
  let remainingMs: number = 0;
  let reminder: number = dateNow();

  for (let i = 1; ; i ++) {
    if (tools.abortCtrl.signal.aborted) return;

    const { done, value: chunk = new Uint8Array(0) }: ReadableStreamReadResult<Uint8Array> = await reader.read();
    if (done) break;

    const now: number = dateNow();
    const bytes: number = chunk.byteLength;
    const deltaMs: number = now - reminder;

    loaded += bytes;

    if (i > 1 && deltaMs && total !== loaded) {
      speed = bytes / deltaMs;
      remainingMs = (total - loaded) / speed;
      reminder = now;
    }

    tools.dlCb?.({
      chunk,
      remainingMs,
      iteration: i,
      loaded,
      percent: loaded / total,
      speed,
      total,
    });
  }
}
