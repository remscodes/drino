import { ReadType } from '@_/models/config.model';

export function bodyFromReadType(fetchResponse: Response, read: ReadType): Promise<any> {
  switch (read) {
    case 'text':
      return fetchResponse.text();
    case 'blob':
      return fetchResponse.blob();
    case 'arrayBuffer':
      return fetchResponse.arrayBuffer();
    case 'formData':
      return fetchResponse.formData();
    default :
      if (read !== 'response' && read !== 'json') throw `Invalid read value used : ${read}.`;
      return fetchResponse.json();
  }
}
