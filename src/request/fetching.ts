import { inspectDownloadProgress } from '../features/progress/download-progress';
import { needRetry } from '../features/retry/retry-util';
import type { UnwrapHttpResponse } from '../models/http.model';
import { HttpErrorResponse, HttpResponse } from '../response';
import { convertBody } from '../response/response-util';
import { getRetryAfter, inferContentType, isJsonContentType, setContentType } from '../utils/headers-util';
import { sleep } from '../utils/promise-util';
import type { HttpRequest } from './http-request';
import type { FetchTools } from './models/fetch-tools.model';

export async function performHttpRequest<T>(req: HttpRequest, tools: FetchTools, retryCount: number = 0): Promise<T> {
  const fetchResponse: Response = await performFetch(req, tools);
  const { headers, ok, status, statusText, url } = fetchResponse;

  if (!ok) {
    const error: string = isJsonContentType(headers) ? await fetchResponse.json()
      : await fetchResponse.text();

    const errorResponse = new HttpErrorResponse({ error, headers, status, statusText, url });

    if (retryCount === 0) await tools.interceptors.afterConsume({ req, res: errorResponse, ok, ctx: tools.context });

    const hasToRetry: boolean = needRetry(tools.retry, status, req.method, retryCount, tools.abortCtrl);
    if (hasToRetry) {
      const delay: number = (tools.retry.withRetryAfter && getRetryAfter(headers)) || tools.retry.delay;
      if (delay) await sleep(delay);

      retryCount ++;

      tools.retryCb?.({ abort: (r) => tools.abortCtrl.abort(r), count: retryCount, delay, error });

      return performHttpRequest(req, tools, retryCount);
    }

    await tools.interceptors.beforeError({ req, errRes: errorResponse, err: error, ctx: tools.context });

    throw errorResponse;
  }

  const isHeadOrOptions: boolean = (req.method === 'HEAD' || req.method === 'OPTIONS');
  const body: Headers | UnwrapHttpResponse<T> = (isHeadOrOptions) ? headers
    : await convertBody<T>(fetchResponse, req.read);

  const httpResponse = new HttpResponse<UnwrapHttpResponse<T>>({
    body: (isHeadOrOptions) ? undefined : body,
    headers,
    status,
    statusText,
    url,
  });

  if (retryCount === 0) await tools.interceptors.afterConsume({ req, res: httpResponse, ok, ctx: tools.context });

  if (tools.dlCb && fetchResponse.status !== 204) await inspectDownloadProgress(fetchResponse, tools).catch(console.error);

  const result = (req.wrapper === 'response') ? httpResponse : body as any;

  await tools.interceptors.beforeResult({ req, ctx: tools.context, res: httpResponse });

  return result;
}

function performFetch(req: HttpRequest, tools: FetchTools): Promise<Response> {
  const { headers, method, url, body: requestBody } = req;
  const { abortCtrl: { signal }, fetchInit, fetch: fetchFn } = tools;

  const fetchOptions: RequestInit = { ...fetchInit, method, headers, signal };

  if (requestBody) {
    const contentType: string | null = inferContentType(requestBody);
    if (contentType) setContentType(headers, contentType);

    fetchOptions.body = JSON.stringify(requestBody);
  }

  return fetchFn(url, fetchOptions);
}
