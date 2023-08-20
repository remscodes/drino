import type { ReadType } from '../request/models/request-config.model';

const convertRecord: Record<Exclude<ReadType, 'none' | 'auto'>, (r: Response) => Promise<any>> = {
  'string': (r: Response) => r.text(),
  'blob': (r: Response) => r.blob(),
  'arrayBuffer': (r: Response) => r.arrayBuffer(),
  'formData': (r: Response) => r.formData(),
  'object': (r: Response) => r.json()
} as const;

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
