import { emitError } from 'thror';
import type { UnwrapHttpResponse } from '../models/http.model';
import type { Nullable } from '../models/shared.model';
import type { ReadType } from '../request/models/request-config.model';

export async function convertBody<T>(fetchResponse: Response, read: ReadType): Promise<UnwrapHttpResponse<T>> {
  try {
    return (read === 'auto') ? await inferBody(fetchResponse)
      : await bodyFromReadType(fetchResponse, read);
  }
  catch (err: any) {
    const contentType: Nullable<string> = fetchResponse.headers.get('content-type');
    emitError('DrinoParserException', `Cannot parse body because RequestConfig.read (='${read}') is incompatible with 'content-type' response header (='${contentType}').`, {
      withStack: true,
      original: err,
    });
  }
}

export function inferBody(fetchResponse: Response): Promise<any> {
  const contentType: Nullable<string> = fetchResponse.headers.get('content-type');
  let readType: ReadType = 'none';

  switch (true) {
    case contentType?.includes('application/json'):
      readType = 'object';
      break;

    case contentType?.includes('text/plain'):
      readType = 'string';
      break;

    case contentType?.includes('application/octet-stream'):
      readType = 'blob';
      break;

    case contentType?.includes('multipart/form-data'):
      readType = 'formData';
      break;
  }

  return bodyFromReadType(fetchResponse, readType);
}

const RESPONSE_METHOD_KEY_MAP: Record<ReadType, string | null> = {
  string: 'text',
  blob: 'blob',
  arrayBuffer: 'arrayBuffer',
  formData: 'formData',
  object: 'json',
  auto: null,
  none: null,
};

export function bodyFromReadType(fetchResponse: Response, read: ReadType): Promise<any> {
  const methodKey: Nullable<string> = RESPONSE_METHOD_KEY_MAP[read];
  if (methodKey === undefined) return Promise.reject('Invalid read type');
  if (methodKey === null) return Promise.resolve();

  // @ts-ignore
  return fetchResponse[methodKey]();
}
