import { ReadType } from '@_/models/options.model';
import { Nullable } from '@_/models/shared.model';

interface DrinoResponseInit {
  fetchResponse: Response;
  headers: Headers;
  status: number;
  statusText: string;
  ok: boolean;
}

export class DrinoResponse<Resource> {

  public constructor(init: DrinoResponseInit) {
    const { headers, status, statusText, ok, fetchResponse } = init;

    this._fetchResponse = fetchResponse;

    this.headers = headers;
    this.status = status;
    this.statusText = statusText;
    this.ok = ok;

    const contentType: Nullable<string> = headers.get('content-type');

    this.readType
      = (contentType === 'application/json') ? 'json'
      : (contentType === 'application/octet-stream') ? 'blob'
        : (contentType === 'multipart/form-data') ? 'formData'
          : 'text';

    this.statusType
      = (status < 200) ? 'Info'
      : (status < 300) ? 'Success'
        : (status < 400) ? 'Redirection'
          : (status < 500) ? 'ClientError'
            : 'ServerError';
  }

  private readonly _fetchResponse: Response;

  public readonly headers: Headers;
  public readonly status: number;
  public readonly statusText: string;
  public readonly ok: boolean;

  public readonly readType: ReadType;
  public readonly statusType: 'Info' | 'Success' | 'Redirection' | 'ClientError' | 'ServerError';

  public toJson(): Promise<Extract<Resource, object>> {
    return this._fetchResponse.json();
  }

  public toText(): Promise<string> {
    return this._fetchResponse.text();
  }

  public toBlob(): Promise<Blob> {
    return this._fetchResponse.blob();
  }

  public toArrayBuffer(): Promise<ArrayBuffer> {
    return this._fetchResponse.arrayBuffer();
  }

  public toFormData(): Promise<FormData> {
    return this._fetchResponse.formData();
  }
}
