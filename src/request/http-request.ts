import type { RequestMethodType, Url } from '../models/http.model';
import { buildUrl } from '../utils/url-util';
import type { ReadType, WrapperType } from './models/request-config.model';

interface HttpRequestInit<T = unknown> {
  method: RequestMethodType;
  url: Url;
  baseUrl: URL;
  prefix: Exclude<Url, URL>;
  headers: Headers;
  queryParams: URLSearchParams;
  body: T | null;
  read: ReadType;
  wrapper: WrapperType;
}

export class HttpRequest<T = unknown> {

  public constructor(init: HttpRequestInit<T>) {
    const { read, headers, url, body, method, wrapper, prefix, queryParams, baseUrl } = init;

    this.method = method;
    this.headers = headers;
    this.body = body;
    this.read = read;
    this.wrapper = wrapper;
    this.url = buildUrl({ baseUrl, prefix, url, queryParams });
  }

  public readonly method: RequestMethodType;
  public readonly url: URL;
  public readonly headers: Headers;
  public readonly body: T | null;
  public readonly read: ReadType;
  public readonly wrapper: WrapperType;
}
