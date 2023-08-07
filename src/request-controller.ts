import { DrinoResponse } from './drino-response';
import type { Config, InferReadType, ReadType, RetryConfig } from './models/config.model';
import type { RequestMethodType, Url } from './models/http.model';
import type { CheckCallback, Modifier, Observer, RequestProcessResult } from './models/request-controller.model';
import type { Nullable, Optional } from './models/shared.model';
import { keysOf } from './utils/object-util';
import { bodyFromReadType } from './utils/response-util';

interface DrinoRequestInit<Read extends ReadType> {
  method: RequestMethodType;
  url: Url;
  body?: any;
  config?: Config<Read>;
}

export class RequestController<Resource> {

  public constructor(init: DrinoRequestInit<InferReadType<Resource>>) {
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
  private readonly url: Url;
  private readonly body: any;

  private readonly options: Config<InferReadType<Resource>>;

  private readonly read: Optional<InferReadType<Resource>>;

  private readonly abortCtrl: Optional<AbortController>;
  private readonly signal: AbortSignal;

  private readonly retry: Optional<RetryConfig>;

  private readonly modifiers: Modifier[] = [];

  public transform(): RequestController<Resource>;
  public transform<NewResource>(modifier: Modifier<Resource, NewResource>): RequestController<NewResource>;
  public transform(...modifiers: Modifier[]): RequestController<any> {
    this.modifiers.push(...modifiers);
    return this;
  }

  public consume(): Promise<Resource>;
  public consume(observer: Observer<Resource>): void;
  public consume(observer?: Observer<Resource>): Promise<Resource> | void {
    if (!observer) return this.thenable();
    this.useObserver(observer);
  }

  public check(): RequestController<Resource>;
  public check(checkFn: CheckCallback<Resource>): RequestController<Resource>;
  public check(checkFn?: CheckCallback<any>): RequestController<any> {
    if (checkFn) {
      this.modifiers.push((result) => {
        checkFn(result);
        return result;
      });
    }
    return this;
  }

  private async thenable(): Promise<Resource> {
    let { result, ok } = await this.processRequest();
    if (!ok) throw result;

    for (const modifier of this.modifiers) result = await modifier(result);
    return result as any;
  }

  private useObserver(observer: Observer<Resource>): void {
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

  private async processRequest(): Promise<RequestProcessResult<Resource, InferReadType<Resource>>> {
    const fetchResponse: Response = await this.useFetch();

    const { headers, status, statusText, ok, url } = fetchResponse;

    const body = await this.convertBody(fetchResponse);

    return {
      ok,
      result: (this.read === 'response')
        ? new DrinoResponse<Resource>({ headers, status, statusText, ok, body, url })
        : body as any
    };
  }

  private useFetch(): Promise<Response> {
    const { headers, signal, withCredentials } = this.options;

    return fetch(this.buildUrl(), {
      method: this.method,
      body: this.body && JSON.stringify(this.body),
      headers,
      signal,
      credentials: (withCredentials) ? 'include' : 'omit'
    });
  }

  private convertBody(fetchResponse: Response): Promise<Resource> {
    if (this.read) return bodyFromReadType(fetchResponse, this.read);

    else {
      const contentType: Nullable<string> = fetchResponse.headers.get('content-type');

      const readType: ReadType
        = (contentType === 'application/json') ? 'object'
        : (contentType === 'application/octet-stream') ? 'blob'
          : (contentType === 'multipart/form-data') ? 'formData'
            : 'string';

      return bodyFromReadType(fetchResponse, readType);
    }
  }

  private buildUrl(): URL {
    const { prefix, queryParams } = this.options;

    const url: URL = new URL(this.url, prefix);

    if (queryParams && (queryParams?.size || keysOf(queryParams).length)) {
      const searchParams: URLSearchParams = (queryParams instanceof URLSearchParams)
        ? queryParams
        : new URLSearchParams(queryParams);

      searchParams.forEach((value: string, key: string) => {
        url.searchParams.set(key, value);
      });
    }

    return url;
  }
}
