import { emitError } from 'thror';
import type { Interceptors } from '../features/interceptors/models/interceptor.model';
import type { DrinoDefaultConfig } from '../models/drino.model';
import type { FetchFn, RequestMethodType, UnwrapHttpResponse, Url } from '../models/http.model';
import { HttpErrorResponse, HttpResponse } from '../response';
import { convertBody } from '../utils/convert-util';
import { buildUrl } from '../utils/url-util';
import type { ReadType, RequestConfig, WrapperType } from './models/request-config.model';
import type { CheckCallback, Modifier, Observer } from './models/request-controller.model';

interface DrinoRequestInit<Read extends ReadType> {
  method: RequestMethodType;
  url: Url;
  body?: any;
  config?: RequestConfig<Read>;
}

export class RequestController<Resource> {

  public constructor(init: DrinoRequestInit<any>, defaultConfig: DrinoDefaultConfig) {
    const { method, url, body, config = {} } = init;

    this.defaultConfig = defaultConfig;

    this.method = method;
    this.url = url;
    this.body = body;
    this.config = config;

    this.read = config.read ?? 'object';
    this.wrapper = config.wrapper ?? 'none';

    this.signal = (!config.signal) ? this.abortCtrl.signal
      : config.signal;

    this.interceptors = {
      ...defaultConfig.requestsConfig?.interceptors ?? {},
      ...config.interceptors ?? {}
    };

    // this.request = new HttpRequest({
    //   headers
    // })
  }

  private readonly defaultConfig: DrinoDefaultConfig;

  // private readonly request: HttpRequest;

  private readonly method: RequestMethodType;
  private readonly url: Url;
  private readonly body: any;
  private readonly config: RequestConfig<any, any>;

  private readonly read: ReadType;
  private readonly wrapper: WrapperType;

  private readonly abortCtrl: AbortController = new AbortController();
  private readonly signal: AbortSignal;

  private readonly interceptors: Interceptors;

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
      return result;
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
        }
      })
      .catch((err: Error) => {
        if (this.signal.aborted) return observer.abort?.(this.signal.reason);
        observer.error?.(err);
      })
      .finally(() => observer.finish?.());
  }

  private async processRequest(): Promise<any> {
    const fetchResponse: Response = await this.performFetch();

    const { headers, status, statusText, ok, url } = fetchResponse;

    if (!ok) {
      const error = await fetchResponse.text();
      const errorResponse = new HttpErrorResponse({
        error,
        headers: new Headers(headers),
        status,
        statusText,
        url
      });
      return Promise.reject(errorResponse);
    }

    try {
      const body = (this.method === 'HEAD' || this.method === 'OPTIONS') ? headers
        : await convertBody(fetchResponse, this.read);

      return {
        ok,
        result: (this.wrapper === 'response')
          ? new HttpResponse<UnwrapHttpResponse<Resource>>({
            body: (this.method === 'HEAD' || this.method === 'OPTIONS') ? undefined : body,
            headers: new Headers(headers),
            status,
            statusText,
            url
          })
          : body
      };
    }
    catch (err: any) {
      emitError('Fetch Response', `Cannot parse body because RequestConfig 'read' value (='${this.read}') is incompatible with 'content-type' response header (='${headers.get('content-type')}').`, {
        withStack: true,
        original: err
      });
    }
  }

  private performFetch(fetchFn: FetchFn = fetch): Promise<Response> {
    const { headers: configHeaders = {} } = this.config;

    const headers: Headers = new Headers(configHeaders);
    headers.set('Content-Type', 'application/json');

    const requestUrl: URL = buildUrl({
      url: this.url,
      prefix: this.config.prefix ?? this.defaultConfig.requestsConfig?.prefix,
      baseUrl: this.defaultConfig.baseUrl,
      queryParams: this.config.queryParams
    });

    return fetchFn(requestUrl, {
      method: this.method,
      headers,
      body: (this.body !== undefined && this.body !== null) ? JSON.stringify(this.body) : undefined,
      signal: this.signal
      // credentials: (withCredentials) ? 'include' : 'omit'
    });
  }
}
