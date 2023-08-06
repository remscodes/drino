interface DrinoResponseInit<Data = any> {
  url: string;
  headers: Headers;
  status: number;
  statusText: string;
  ok: boolean;
  body: Data;
}

export class DrinoResponse<Resource> {

  public constructor(init: DrinoResponseInit) {
    const { headers, status, statusText, ok, body, url } = init;

    this.url = new URL(url);
    this.headers = headers;
    this.status = status;
    this.statusText = statusText;
    this.ok = ok;
    this.body = body;

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
  public readonly ok: boolean;
  public readonly body: Resource;
  public readonly statusType: 'Info' | 'Success' | 'Redirection' | 'ClientError' | 'ServerError';
}
