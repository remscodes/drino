import type { StatusType } from '../models/http.model';

export interface HttpCommonResponseInit {
  url: string;
  headers: Headers;
  status: number;
  statusText: string;
}

export abstract class HttpCommonResponse {

  protected constructor(init: HttpCommonResponseInit) {
    const { headers, url, status, statusText } = init;

    this.url = new URL(url);
    this.headers = headers;
    this.status = status;
    this.statusText = statusText;
    this.statusType
      = (status < 200) ? 'Info'
      : (status < 300) ? 'Success'
        : (status < 400) ? 'Redirection'
          : (status < 500) ? 'ClientError'
            : 'ServerError';
  }

  public readonly url: URL;
  public readonly headers: Headers;
  public readonly status: number;
  public readonly statusText: string;
  public readonly statusType: StatusType;
}
