import { inspectDownloadProgress } from '../features/progress/download-progress';
import { needRetry } from '../features/retry/retry-util';
import type { UnwrapHttpResponse } from '../models/http.model';
import { HttpErrorResponse, HttpResponse } from '../response';
import { convertBody } from '../response/response-util';
import { getRetryAfter, inferContentType, isJsonContentType } from '../utils/headers-util';
import { sleep } from '../utils/promise-util';
import type { HttpRequest } from './http-request';
import type { FetchTools } from './models/fetch-tools.model';

export async function performHttpRequest<T>(request: HttpRequest, tools: FetchTools, retryCount: number = 0): Promise<T> {
  const fetchResponse: Response = await performFetch(request, tools);
  const { headers, ok, status, statusText, url } = fetchResponse;

  if (!ok) {
    const error: string = isJsonContentType(headers) ? await fetchResponse.json()
      : await fetchResponse.text();

    const errorResponse = new HttpErrorResponse({ error, headers, status, statusText, url });

    if (retryCount === 0) tools.interceptors.afterConsume(request, errorResponse, !ok);

    const hasToRetry: boolean = needRetry(tools.retry, status, request.method, retryCount, tools.abortCtrl);
    if (hasToRetry) {
      const delay: number = (tools.retry.withRetryAfter && getRetryAfter(headers)) || tools.retry.delay;
      if (delay) await sleep(delay);

      retryCount ++;

      tools.retryCb?.({ abort: tools.abortCtrl.abort, count: retryCount, delay, error });

      return performHttpRequest(request, tools, retryCount);
    }

    tools.interceptors.beforeError(errorResponse);

    throw errorResponse;
  }

  const isHeadOrOptions: boolean = (request.method === 'HEAD' || request.method === 'OPTIONS');
  const body: Headers | UnwrapHttpResponse<T> = (isHeadOrOptions) ? headers
    : await convertBody<T>(fetchResponse, request.read);

  const httpResponse = new HttpResponse<UnwrapHttpResponse<T>>({
    body: (isHeadOrOptions) ? undefined : body,
    headers,
    status,
    statusText,
    url,
  });

  if (retryCount === 0) tools.interceptors.afterConsume(request, httpResponse, !ok);

  if (tools.dlCb && fetchResponse.status !== 204) await inspectDownloadProgress(fetchResponse, tools).catch(console.error);

  const result = (request.wrapper === 'response') ? httpResponse : body as any;

  tools.interceptors.beforeResult(result);

  return result;
}

function performFetch(request: HttpRequest, tools: FetchTools): Promise<Response> {
  const { headers, method, url, body: requestBody } = request;
  const { abortCtrl: { signal }, fetchInit, fetch: fetchFn } = tools;

  const fetchOptions: RequestInit = { ...fetchInit, method, headers, signal };

  if (requestBody) {
    const contentType: string | null = inferContentType(requestBody);
    if (contentType) headers.set('content-type', contentType);

    fetchOptions.body = JSON.stringify(requestBody);
  }

  return fetchFn(url, fetchOptions);
}
