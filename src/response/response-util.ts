import { emitError } from 'thror';
import { CONTENT_TYPE_BLOB, CONTENT_TYPE_FORM_DATA, CONTENT_TYPE_STRING, HEADER_CONTENT_TYPE } from '../constants/headers.contants';
import { READ_ARRAY_BUFFER, READ_AUTO, READ_BLOB, READ_FORM_DATA, READ_OBJECT, READ_STRING } from '../constants/read.constants';
import type { UnwrapHttpResponse } from '../models/http.model';
import type { Nullable } from '../models/shared.model';
import type { ReadType } from '../request/models/request-config.model';

export function convertBody<T>(fetchResponse: Response, read: ReadType): Promise<UnwrapHttpResponse<T>> {
  try {
    return (read === READ_AUTO) ? inferBody(fetchResponse)
      : bodyFromReadType(fetchResponse, read);
  }
  catch (err: any) {
    emitError('Fetch Response', `Cannot parse body because RequestConfig 'read' value (='${read}') is incompatible with '${HEADER_CONTENT_TYPE}' response header (='${fetchResponse.headers.get(HEADER_CONTENT_TYPE)}').`, {
      withStack: true,
      original: err,
    });
  }
}

export function inferBody(fetchResponse: Response): Promise<any> {
  const contentType: Nullable<string> = fetchResponse.headers.get(HEADER_CONTENT_TYPE);

  const readType: ReadType
    = (contentType?.includes(CONTENT_TYPE_STRING)) ? READ_STRING
    : (contentType?.includes(CONTENT_TYPE_BLOB)) ? READ_BLOB
      : (contentType?.includes(CONTENT_TYPE_FORM_DATA)) ? READ_FORM_DATA
        : READ_OBJECT;

  return bodyFromReadType(fetchResponse, readType);
}

export function bodyFromReadType(fetchResponse: Response, read: ReadType): Promise<any> {
  switch (read) {
    case READ_OBJECT:
      return fetchResponse.json();
    case READ_STRING:
      return fetchResponse.text();
    case READ_FORM_DATA:
      return fetchResponse.formData();
    case READ_BLOB:
      return fetchResponse.blob();
    case READ_ARRAY_BUFFER:
      return fetchResponse.arrayBuffer();
    default :
      return Promise.resolve();
  }
}
