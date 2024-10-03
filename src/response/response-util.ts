import { emitError } from 'thror';
import type { UnwrapHttpResponse } from '../models/http.model';
import type { ReadType } from '../request/models/request-config.model';
import { getContentType } from '../utils/headers-util';

export async function convertBody<T>(fetchResponse: Response, read: ReadType): Promise<UnwrapHttpResponse<T>> {
  try {
    return (read === 'auto') ? await inferBody(fetchResponse)
      : await bodyFromReadType(fetchResponse, read);
  }
  catch (err: any) {
    const contentType: string | null = getContentType(fetchResponse.headers);
    emitError('DrinoParserException', `Cannot parse body because RequestConfig.read (='${read}') is incompatible with 'content-type' response header (='${contentType}').`, {
      withStack: true,
      original: err,
    });
  }
}

export function inferBody(fetchResponse: Response): Promise<any> {
  const contentType: string | null = getContentType(fetchResponse.headers);
  if (!contentType) return bodyFromReadType(fetchResponse, 'none');

  let readType: ReadType;

  if (contentType.includes('application/json')) readType = 'object';
  else if (contentType.includes('text/plain')) readType = 'string';
  else if (contentType.includes('application/octet-stream')) readType = 'blob';
  else if (contentType.includes('multipart/form-data')) readType = 'formData';
  else readType = 'none';

  return bodyFromReadType(fetchResponse, readType);
}

export async function bodyFromReadType(fetchResponse: Response, read: ReadTypeWithoutAuto): Promise<any> {
  const methodKey = RESPONSE_METHOD_KEY_MAP[read];
  if (methodKey === undefined) throw 'Invalid read type';
  if (methodKey === null) return;

  return fetchResponse[methodKey]();
}

const RESPONSE_METHOD_KEY_MAP = {
  string: 'text',
  blob: 'blob',
  arrayBuffer: 'arrayBuffer',
  formData: 'formData',
  object: 'json',
  none: null,
} as const satisfies Record<ReadTypeWithoutAuto, string | null>;

type ReadTypeWithoutAuto = Exclude<ReadType, 'auto'>
