import { emitError } from 'thror';
import type { FetchFn, UnwrapHttpResponse } from '../models/http.model';
import { HttpErrorResponse, HttpResponse } from '../response';
import { convertBody } from '../response/response-util';
import { inferBodyContentType } from '../utils/headers-util';
import type { HttpRequest } from './http-request';

export interface FetchExtraTools {
  signal: AbortSignal;
}

export async function performHttpRequest<T>(request: HttpRequest, tools: FetchExtraTools): Promise<T> {
  const fetchResponse: Response = await performFetch(request, tools);

  const { headers, status, statusText, ok, url } = fetchResponse;

  if (!ok) {
    const error = await fetchResponse.text();
    return Promise.reject(new HttpErrorResponse({
      error,
      headers,
      status,
      statusText,
      url
    }));
  }

  const isHeadOrOptions: boolean = (request.method === 'HEAD' || request.method === 'OPTIONS');

  try {
    const body = (isHeadOrOptions) ? headers : await convertBody(fetchResponse, request.read);

    return (request.wrapper === 'response')
      ? new HttpResponse<UnwrapHttpResponse<T>>({
        body: (isHeadOrOptions) ? undefined : body,
        headers,
        status,
        statusText,
        url
      })
      : body as any;
  }
  catch (err: any) {
    emitError('Fetch Response', `Cannot parse body because RequestConfig 'read' value (='${request.read}') is incompatible with 'content-type' response header (='${headers.get('content-type')}').`, {
      withStack: true,
      original: err
    });
  }
}

function performFetch(request: HttpRequest, tools: FetchExtraTools, fetchFn: FetchFn = fetch): Promise<Response> {
  const { headers, method, url, body } = request;

  inferBodyContentType(body, headers);

  return fetchFn(url, {
    method,
    headers,
    body: (body !== undefined && body !== null) ? JSON.stringify(body) : undefined,
    signal: tools.signal
  });
}
