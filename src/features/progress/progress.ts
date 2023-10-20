import type { Nullable } from '../../models/shared.model';
import type { FetchTools } from '../../request/fetching';
import { now as dateNow } from '../../utils/date-util';

export function inspectUploadProgress(body: any, tools: FetchTools): ReadableStream {
  const buffer: Uint8Array = new Uint8Array(1024 * 50);
  const start: number = Date.now();
  let uploaded: number = 0;

  return new ReadableStream({
    pull: (ctrl: ReadableStreamDefaultController) => {
      uploaded += buffer.byteLength;
      console.log('uploaded', uploaded);
      crypto.getRandomValues(buffer);
      ctrl.enqueue(buffer);
      if ((start + 1000) < Date.now()) ctrl.close();
    },
    cancel: (reason: any) => {
      tools.abortTools.abortCtrl.abort(reason);
    },
  });
}

export async function inspectDownloadProgress(response: Response, tools: FetchTools): Promise<void> {
  const body: Nullable<ReadableStream<Uint8Array>> = response.clone().body;
  if (!body) return;

  const reader: ReadableStreamDefaultReader<Uint8Array> = body.getReader();

  const contentLength: string = response.headers.get('content-length') ?? '0';
  const total: number = parseInt(contentLength, 10);

  let loaded: number = 0;
  let speed: number = 0;
  let remainingTimeMs: number = 0;
  let reminder: number = dateNow();

  for (let i = 1; ; i ++) {
    const { done, value: chunk = new Uint8Array(0) }: ReadableStreamReadResult<Uint8Array> = await reader.read();
    if (done) break;

    const now: number = dateNow();
    const bytes: number = chunk.byteLength;
    const deltaMs: number = now - reminder;

    loaded += bytes;

    if (i > 1 && deltaMs && total !== loaded) {
      speed = bytes / deltaMs;
      remainingTimeMs = (total - loaded) / speed;
      reminder = now;
    }

    tools.dlCb?.({
      chunk,
      remainingTimeMs,
      iteration: i,
      loaded,
      percent: loaded / total,
      speed,
      total,
    });
  }
}
