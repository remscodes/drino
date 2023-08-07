interface DrinoErrorResponseInit {
  url: string;
  headers: Headers;
  status: number;
  statusText: string;
  error: Error;
}

export class DrinoErrorResponse {

  public constructor(init: DrinoErrorResponseInit) {
    const { headers, status, statusText, error, url } = init;

    this.url = new URL(url);
    this.headers = headers;
    this.status = status;
    this.statusText = statusText;
    this.error = error;

    this.statusType
      = (status < 500) ? 'ClientError'
      : 'ServerError';
  }

  public readonly url: URL;
  public readonly headers: Headers;
  public readonly status: number;
  public readonly statusText: string;
  public readonly error: Error;
  public readonly statusType: 'ClientError' | 'ServerError';
}
