import type { UnwrapHttpResponse } from '../models/http.model';
import type { Nullable } from '../models/shared.model';
import type { ReadType } from '../request/models/request-config.model';
import { bodyFromReadType } from '../response/response-util';

export function convertBody<T>(fetchResponse: Response, read: ReadType): Promise<UnwrapHttpResponse<T>> {
  if (read !== 'auto') return bodyFromReadType(fetchResponse, read);

  const contentType: Nullable<string> = fetchResponse.headers.get('content-type');

  const readType: ReadType
    = (contentType?.includes('text/plain')) ? 'string'
    : (contentType?.includes('application/octet-stream')) ? 'blob'
      : (contentType?.includes('multipart/form-data')) ? 'formData'
        : 'object';

  return bodyFromReadType(fetchResponse, readType);
}
