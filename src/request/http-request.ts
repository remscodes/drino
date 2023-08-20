import type { RequestMethodType } from '../models/http.model';
import type { Nullable } from '../models/shared.model';
import type { ReadType } from './models/request-config.model';

interface HttpRequestInit<T = any> {
  method: RequestMethodType;
  url: string;
  headers: Headers;
  body: Nullable<T>;
  read: ReadType;
}

export class HttpRequest<T = unknown> {

  public constructor(init: HttpRequestInit<T>) {
    this.url = new URL(init.url);
    this.headers = init.headers;
    this.body = init.body;
    this.read = init.read;
  }

  public readonly url: URL;
  public readonly headers: Headers;
  public readonly body: Nullable<T>;
  public readonly read: ReadType;
}
