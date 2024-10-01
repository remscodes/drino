import { inspectDownloadProgress } from '../features/progress/download-progress';
import { needRetry } from '../features/retry/retry-util';
import type { UnwrapHttpResponse } from '../models/http.model';
import { HttpErrorResponse, HttpResponse } from '../response';
import { convertBody } from '../response/response-util';
import { getRetryAfter, inferContentType } from '../utils/headers-util';
import { sleep } from '../utils/promise-util';
import type { HttpRequest } from './http-request';
import type { FetchTools } from './models/fetch-tools.model';

export async function performHttpRequest<T>(request: HttpRequest, tools: FetchTools, retried: number = 0): Promise<T> {
  const fetchResponse: Response = await performFetch(request, tools);

  tools.interceptors.afterConsume(request, fetchResponse);

  const { headers, status, statusText, ok, url } = fetchResponse;

  if (!ok) {
    const error: string = headers.get('content-type')?.includes('application/json')
      ? await fetchResponse.json()
      : await fetchResponse.text();

    if (needRetry(tools.retry, status, request.method, retried, tools.abortCtrl)) {

      const delay: number = (tools.retry.withRetryAfter && getRetryAfter(headers)) || tools.retry.delay;
      if (delay) await sleep(delay);

      retried ++;

      tools.retryCb?.({
        abort: (reason?: any) => tools.abortCtrl.abort(reason),
        count: retried,
        delay,
        error,
      });

      return performHttpRequest(request, tools, retried);
    }

    const errorResponse: HttpErrorResponse = new HttpErrorResponse({
      error,
      headers,
      status,
      statusText,
      url,
    });
    tools.interceptors.beforeError(errorResponse);
    return Promise.reject(errorResponse);
  }

  if (tools.dlCb && fetchResponse.status !== 204) {
    await inspectDownloadProgress(fetchResponse, tools).catch(console.error);
  }

  const isHeadOrOptions: boolean = (request.method === 'HEAD' || request.method === 'OPTIONS');

  const body: Headers | UnwrapHttpResponse<T> = (isHeadOrOptions) ? headers
    : await convertBody<T>(fetchResponse, request.read);

  const result = (request.wrapper === 'response') ? new HttpResponse<UnwrapHttpResponse<T>>({
      body: (isHeadOrOptions) ? undefined : body,
      headers,
      status,
      statusText,
      url,
    })
    : body as any;

  tools.interceptors.beforeResult(result);

  return result;
}

function performFetch(request: HttpRequest, tools: FetchTools): Promise<Response> {
  const { headers, method, url, body: requestBody } = request;
  const { abortCtrl: { signal }, fetchInit, fetch: fetchFn } = tools;

  const fetchOptions: RequestInit = { ...fetchInit, method, headers, signal };

  let body: any;

  if (requestBody) {
    const contentType: string = inferContentType(requestBody);
    headers.set('content-type', contentType);

    // if (tools.ulCb) {
    //   fetchOptions.duplex = 'half';
    //   body = inspectUploadProgress(requestBody, tools, contentType);
    // }
    // else {
    body = JSON.stringify(requestBody);
    // }
  }

  fetchOptions.body = body;

  return fetchFn(url, fetchOptions);
}
