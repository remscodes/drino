import type { ReadType } from '../request/models/request-config.model';

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
    case 'response':
    case 'object':
      return fetchResponse.json();
    default :
      return Promise.resolve();
  }
}
