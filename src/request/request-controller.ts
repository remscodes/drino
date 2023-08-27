import { fixChromiumAndWebkitTimeoutError, fixFirefoxAbortError } from '../features/abort/abort-util';
import type { DrinoDefaultConfigInit } from '../models/drino.model';
import type { RequestMethodType, Url } from '../models/http.model';
import type { FetchExtraTools } from './fetching';
import { performHttpRequest } from './fetching';
import { HttpRequest } from './http-request';
import type { DefinedConfig, RequestConfig } from './models/request-config.model';
import type { CheckCallback, Modifier, Observer } from './models/request-controller.model';
import { mergeRequestConfigs } from './request-util';

interface DrinoRequestInit {
  method: RequestMethodType;
  url: Url;
  body?: any;
  config?: RequestConfig<any, any>;
}

export class RequestController<Resource> {

  public constructor(init: DrinoRequestInit, defaultConfig: DrinoDefaultConfigInit) {
    const { method, url, body, config = {} } = init;

    this.config = mergeRequestConfigs(defaultConfig, config);

    this.request = new HttpRequest({
      method,
      url,
      body,
      headers: this.config.headers,
      read: this.config.read,
      wrapper: this.config.wrapper,
      prefix: this.config.prefix,
      queryParams: this.config.queryParams,
      baseUrl: this.config.baseUrl
    });
  }

  private readonly config: DefinedConfig;

  private readonly request: HttpRequest;

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
    this.config.interceptors.beforeConsume(this.request);

    const tools: FetchExtraTools = {
      signal: this.config.signal,
      interceptors: this.config.interceptors
    };

    if (!observer) return this.thenable(tools);
    this.useObserver(observer, tools);
  }

  private async thenable(tools: FetchExtraTools): Promise<Resource> {
    try {
      let result = await performHttpRequest<Resource>(this.request, tools);
      for (const modifier of this.modifiers) result = await modifier(result);
      return result;
    }
    catch (err: unknown) {
      return this.catchable(err);
    }
    finally {
      this.config.interceptors.beforeFinish();
    }
  }

  private useObserver(observer: Observer<Resource>, tools: FetchExtraTools): void {
    performHttpRequest<Resource>(this.request, tools)
      .then(async (result) => {
        try {
          for (const modifier of this.modifiers) result = await modifier(result);
          observer.result?.(result as any);
        }
        catch (err: unknown) {
          return this.catchable(err);
        }
      })
      .catch((err: Error) => {
        if (this.config.signal.aborted) return observer.abort?.(this.config.signal.reason);
        observer.error?.(err);
      })
      .finally(() => {
        this.config.interceptors.beforeFinish();
        observer.finish?.();
      });
  }

  private catchable(thrown: any): Promise<any> {
    const error: any = (this.config.signal.aborted) ?
      (this.config.signal.abortedByTimeout) ? fixChromiumAndWebkitTimeoutError(thrown)
        : fixFirefoxAbortError(thrown)
      : thrown;

    return Promise.reject(error);
  }
}
