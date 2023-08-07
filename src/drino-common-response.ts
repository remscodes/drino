export interface DrinoCommonResponseInit {
  url: string;
  headers: Headers;
  status: number;
  statusText: string;
}

export class DrinoCommonResponse {

  public constructor(init: DrinoCommonResponseInit) {
    const { headers, url, status, statusText } = init;
    this.url = new URL(url);
    this.headers = headers;
    this.status = status;
    this.statusText = statusText;
  }

  public readonly url: URL;
  public readonly headers: Headers;
  public readonly status: number;
  public readonly statusText: string;
}
