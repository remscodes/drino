import type { RetryConfig } from '../features';
import type { DrinoDefaultConfig } from '../models/drino.model';
import type { RequestMethodType, Url } from '../models/http.model';
import type { Nullable, Optional } from '../models/shared.model';
import { DrinoResponse } from '../response';
import { keysOf } from '../utils/object-util';
import { bodyFromReadType } from '../utils/response-util';
import { createUrl } from '../utils/url-util';
import type { InferReadType, ReadType, RequestConfig } from './models/request-config.model';
import type { CheckCallback, Modifier, Observer, RequestProcessResult } from './models/request-controller.model';

interface DrinoRequestInit<Read extends ReadType> {
  method: RequestMethodType;
  url: Url;
  body?: any;
  config?: RequestConfig<Read>;
}

export class RequestController<Resource> {

  public constructor(init: DrinoRequestInit<InferReadType<Resource>>, defaultConfig: DrinoDefaultConfig) {
    const { method, url, body, config = {} } = init;

    this.defaultConfig = defaultConfig;

    this.method = method;
    this.url = url;
    this.body = body;
    this.config = config;

    this.read = config.read;

    if (!config.signal) {
      this.abortCtrl = new AbortController();
      this.signal = this.abortCtrl.signal;
    }
    else {
      this.signal = config.signal;
    }

    // this.retry = config.retry;
  }

  private readonly defaultConfig: DrinoDefaultConfig;

  private readonly method: RequestMethodType;
  private readonly url: Url;
  private readonly body: any;

  private readonly config: RequestConfig<InferReadType<Resource>>;

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

  public consume(): Promise<Resource>;
  public consume(observer: Observer<Resource>): void;
  public consume(observer?: Observer<Resource>): Promise<Resource> | void {
    if (!observer) return this.thenable();
    this.useObserver(observer);
  }

  private async thenable(): Promise<Resource> {
    try {
      let { result, ok } = await this.processRequest();
      if (!ok) return Promise.reject(result);

      for (const modifier of this.modifiers) result = await modifier(result);
      return result as any;
    }
    catch (err: any) {
      return Promise.reject(err);
    }
  }

  private useObserver(observer: Observer<Resource>): void {
    this.processRequest()
      .then(async ({ result, ok }) => {
        if (!ok) return Promise.reject(result);

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
        if (this.signal.aborted) return observer.abort?.(this.signal.reason);
        observer.error?.(err);
      })
      .finally(() => {
        observer.finish?.();
      });
  }

  private async processRequest(): Promise<RequestProcessResult<Resource, InferReadType<Resource>>> {
    const fetchResponse: Response = await this.useFetch();

    const { headers = {}, status, statusText, ok, url } = fetchResponse;

    const body = await this.convertBody(fetchResponse);

    return {
      ok,
      result: (this.read === 'response')
        ? new DrinoResponse<Resource>({
          body,
          headers: new Headers(headers),
          ok,
          status,
          statusText,
          url
        })
        : body as any
    };
  }

  private useFetch(): Promise<Response> {
    const { headers: configHeaders = {} } = this.config;

    const headers: Headers = new Headers(configHeaders);
    headers.set('Content-Type', 'application/json');

    return fetch(this.buildUrl(), {
      method: this.method,
      body: (this.body !== undefined && this.body !== null) ? JSON.stringify(this.body) : undefined,
      headers,
      signal: this.signal
      // credentials: (withCredentials) ? 'include' : 'omit'
    });
  }

  private convertBody(fetchResponse: Response): Promise<Resource> {
    if (this.read) return bodyFromReadType(fetchResponse, this.read);

    else {
      const contentType: Nullable<string> = fetchResponse.headers.get('content-type');

      const readType: ReadType
        = (contentType?.includes('application/json')) ? 'object'
        : (contentType?.includes('application/octet-stream')) ? 'blob'
          : (contentType?.includes('multipart/form-data')) ? 'formData'
            : 'string';

      return bodyFromReadType(fetchResponse, readType);
    }
  }

  private buildUrl(): URL {
    const { baseUrl, requestConfig } = this.defaultConfig;
    const prefix: string = requestConfig?.prefix ?? '';

    const { queryParams } = this.config;

    const url: URL = createUrl(`${prefix}${this.url}`.replace(/\/$/, ''), baseUrl);

    if (queryParams && (queryParams?.size || keysOf(queryParams).length)) {
      const searchParams: URLSearchParams = new URLSearchParams(queryParams);
      searchParams.forEach((value: string, key: string) => {
        url.searchParams.set(key, value);
      });
    }
    return url;
  }
}
