import type { UnwrapHttpResponse } from '../models/http.model';
import type { Nullable } from '../models/shared.model';
import type { ReadType } from '../request/models/request-config.model';

export function convertBody<T>(fetchResponse: Response, read: ReadType): Promise<UnwrapHttpResponse<T>> {
  return (read === 'auto') ? inferBodyType(fetchResponse)
    : bodyFromReadType(fetchResponse, read);
}

export function inferBodyType(fetchResponse: Response): Promise<any> {
  const contentType: Nullable<string> = fetchResponse.headers.get('content-type');

  const readType: ReadType
    = (contentType?.includes('text/plain')) ? 'string'
    : (contentType?.includes('application/octet-stream')) ? 'blob'
      : (contentType?.includes('multipart/form-data')) ? 'formData'
        : 'object';

  return bodyFromReadType(fetchResponse, readType);
}

export function bodyFromReadType(fetchResponse: Response, read: ReadType): Promise<any> {
  switch (read) {
    case 'string':
      return fetchResponse.text();
    case 'blob':
      return fetchResponse.blob();
    case 'arrayBuffer':
      return fetchResponse.arrayBuffer();
    case 'formData':
      return fetchResponse.formData();
    case 'object':
      return fetchResponse.json();
    default :
      return Promise.resolve();
  }
}
