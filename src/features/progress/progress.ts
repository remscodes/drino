import type { FetchTools } from '../../request/fetching';

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
  const body = response.clone().body;
  if (!body) return;

  const contentLength: string = response.headers.get('content-length') ?? '0';
  const total: number = parseInt(contentLength, 10);
  let loaded: number = 0;

  const reader: ReadableStreamDefaultReader<Uint8Array> = body.getReader();

  while (true) {
    const { done, value }: ReadableStreamReadResult<Uint8Array> = await reader.read();
    if (done) break;

    loaded += value.byteLength;
    tools.dlCb?.({ loaded, total });
  }
}
