import type { Nullable, Optional } from '@_/models/shared.model';
import { DrinoResponse } from './drino-response';
import type { RequestMethodType } from './models/http.model';
import type { Modifier } from './models/modifier.model';
import type { Observer } from './models/observer.model';
import type { Config, ReadType, ReadTypeMap, RetryConfig } from '@_/models/config.model';
import { bodyFromReadType } from './utils/response-util';

interface DrinoRequestInit<Read extends ReadType> {
  method: RequestMethodType;
  url: string;
  body?: any;
  config?: Config<Read>;
}

export class DrinoRequest<Resource, Read extends keyof ReadTypeMap<Resource>> {

  public constructor(init: DrinoRequestInit<Read>) {
    const { method, url, body, config = {} } = init;

    this.method = method;
    this.url = url;
    this.body = body;
    this.options = config;

    this.read = config.read;

    if (!config.signal) {
      this.abortCtrl = new AbortController();
      this.signal = this.abortCtrl.signal;
    }
    else this.signal = config.signal;

    this.retry = config.retry;
  }

  private readonly method: RequestMethodType;
  private readonly url: string;
  private readonly body: any;

  private readonly options: Config<Read>;

  private readonly read: Optional<Read>;

  private readonly abortCtrl: Optional<AbortController>;
  private readonly signal: AbortSignal;

  private readonly retry: Optional<RetryConfig>;

  private readonly modifiers: Modifier[] = [];

  public pipe(): DrinoRequest<Resource, Read>;
  public pipe<A, B>(modifier: Modifier<A, B>): DrinoRequest<B, Read>;
  public pipe(...modifiers: Modifier[]): DrinoRequest<any, Read> {
    this.modifiers.push(...modifiers);
    return this;
  }

  public consume(): Promise<ReadTypeMap<Resource>[Read]>;
  public consume(observer: Observer<ReadTypeMap<Resource>[Read]>): void;
  public consume(observer?: Observer<ReadTypeMap<Resource>[Read]>): Promise<ReadTypeMap<Resource>[Read]> | void {
    if (!observer) return this.thenable();
    this.useObserver(observer);
  }

  private async thenable(): Promise<ReadTypeMap<Resource>[Read]> {
    let { result, ok } = await this.processRequest();
    if (!ok) throw result;

    for (const modifier of this.modifiers) result = await modifier(result);
    return result as any;
  }

  private useObserver(observer: Observer<ReadTypeMap<Resource>[Read]>): void {
    const start: number = Date.now();
    this.processRequest()
      .then(async ({ result, ok }) => {
        if (!ok) {
          return Promise.reject(result);
        }
        try {
          for (const modifier of this.modifiers) result = await modifier(result);
          observer.result?.(result as any);
        }
        catch (err: any) {
          this.abortCtrl?.abort(err);
          console.error(err);
        }
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return observer.abort?.(err);
        observer.error?.(err);
      })
      .finally(() => {
        observer.finish?.(Date.now() - start);
      });
  }

  private async processRequest() {
    const fetchResponse: Response = await this.useFetch();

    const { headers, status, statusText, ok, url } = fetchResponse;

    const body = await this.convertBody(fetchResponse);

    return {
      ok,
      result: (this.read === 'response')
        ? new DrinoResponse<Resource>({ headers, status, statusText, ok, body, url })
        : body
    };
  }

  private useFetch(): Promise<Response> {
    const { headers, signal, withCredentials } = this.options;

    return fetch(this.buildUrl(), {
      method: this.method,
      body: this.body,
      headers,
      signal,
      credentials: (withCredentials) ? 'include' : 'omit'
    });
  }

  private convertBody(fetchResponse: Response): Promise<ReadTypeMap<Resource>[Read]> {
    if (this.read) return bodyFromReadType(fetchResponse, this.read);

    else {
      const contentType: Nullable<string> = fetchResponse.headers.get('content-type');

      const readType: ReadType
        = (contentType === 'application/json') ? 'json'
        : (contentType === 'application/octet-stream') ? 'blob'
          : (contentType === 'multipart/form-data') ? 'formData'
            : 'text';

      return bodyFromReadType(fetchResponse, readType);
    }
  }

  private buildUrl(): URL {
    const { prefix, queryParams } = this.options;

    let baseUrl = this.url;

    if (queryParams && (queryParams?.size || Object.keys(queryParams).length)) {
      const searchParams: URLSearchParams = (queryParams instanceof URLSearchParams)
        ? queryParams
        : new URLSearchParams(queryParams);

      baseUrl = `${baseUrl}?${searchParams}`;
    }

    return new URL(baseUrl, prefix);
  }
}
