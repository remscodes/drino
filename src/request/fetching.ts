import { emitError } from 'thror';
import type { RetryConfig } from '../features';
import type { Interceptors } from '../features/interceptors/models/interceptor.model';
import type { UnwrapHttpResponse } from '../models/http.model';
import { HttpErrorResponse, HttpResponse } from '../response';
import { convertBody } from '../response/response-util';
import { inferContentType } from '../utils/headers-util';
import type { HttpRequest } from './http-request';

export interface FetchTools {
  signal: AbortSignal;
  interceptors: Interceptors;
  retry: Required<RetryConfig>;
}

export async function performHttpRequest<T>(request: HttpRequest, tools: FetchTools): Promise<T> {
  const fetchResponse: Response = await performFetch(request, tools);

  tools.interceptors.afterConsume(request, fetchResponse);

  const { headers, status, statusText, ok, url } = fetchResponse;

  if (!ok) {
    const error = await fetchResponse.text();
    const errorResponse: HttpErrorResponse = new HttpErrorResponse({
      error,
      headers,
      status,
      statusText,
      url
    });
    tools.interceptors.beforeError(errorResponse);
    return Promise.reject(errorResponse);
  }

  const isHeadOrOptions: boolean = (request.method === 'HEAD' || request.method === 'OPTIONS');

  try {
    const body = (isHeadOrOptions) ? headers : await convertBody<T>(fetchResponse, request.read);

    const result = (request.wrapper === 'response')
      ? new HttpResponse<UnwrapHttpResponse<T>>({
        body: (isHeadOrOptions) ? undefined : body,
        headers,
        status,
        statusText,
        url
      })
      : body as any;

    tools.interceptors.beforeResult(result);

    return result;
  }
  catch (err: any) {
    emitError('Fetch Response', `Cannot parse body because RequestConfig 'read' value (='${request.read}') is incompatible with 'content-type' response header (='${headers.get('content-type')}').`, {
      withStack: true,
      original: err
    });
  }
}

function performFetch(request: HttpRequest, tools: FetchTools): Promise<Response> {
  const { headers, method, url, body } = request;

  if (body) {
    const contentType: string = inferContentType(body);
    headers.set('Content-Type', contentType);
  }

  return fetch(url, {
    method,
    headers,
    body: (body !== undefined && body !== null) ? JSON.stringify(body) : undefined,
    signal: tools.signal
  });
}
