import { emitError } from 'thror';
import type { FetchTools } from '../../request/models/fetch-tools.model';
import { now as dateNow } from '../../utils/date-util';
import { getContentLength } from '../../utils/headers-util';

export async function inspectDownloadProgress(response: Response, tools: FetchTools): Promise<void> {
  const body: ReadableStream<Uint8Array> | null = response.clone().body;
  if (!body) return;

  const reader: ReadableStreamDefaultReader<Uint8Array> = body.getReader();

  const total: number | null = getContentLength(response.headers);
  if (!total) emitError('DrinoProgressException', `Cannot inspect download progress on ${response.url} because response "content-length" header is null or 0.`);

  let loaded = 0;
  let speed = 0;
  let remainingTime = 0;
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
      remainingTime = (total - loaded) / speed;
      reminder = now;
    }

    tools.dlCb?.({
      chunk,
      remainingTime,
      iteration: i,
      loaded,
      percent: loaded / total,
      speed,
      total,
    });
  }
}
