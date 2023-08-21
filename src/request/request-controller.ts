import type { DrinoDefaultConfig } from '../models/drino.model';
import type { RequestMethodType, Url } from '../models/http.model';
import { performHttpRequest } from './fetching';
import { HttpRequest } from './http-request';
import type { DefinedConfig, RequestConfig } from './models/request-config.model';
import type { CheckCallback, Modifier, Observer } from './models/request-controller.model';
import { mergeConfigs } from './request-util';

interface DrinoRequestInit {
  method: RequestMethodType;
  url: Url;
  body?: any;
  config?: RequestConfig<any, any>;
}

export class RequestController<Resource> {

  public constructor(init: DrinoRequestInit, defaultConfig: DrinoDefaultConfig) {
    const { method, url, body, config = {} } = init;

    this.config = mergeConfigs(defaultConfig, config);

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
    if (!observer) return this.thenable();
    this.useObserver(observer);
  }

  private async thenable(): Promise<Resource> {
    try {
      let result = await performHttpRequest<Resource>(this.request, { signal: this.config.signal });

      for (const modifier of this.modifiers) result = await modifier(result);
      return result;
    }
    catch (err: any) {
      return Promise.reject(err);
    }
  }

  private useObserver(observer: Observer<Resource>): void {
    performHttpRequest<Resource>(this.request, { signal: this.config.signal })
      .then(async (result) => {
        try {
          for (const modifier of this.modifiers) result = await modifier(result);
          observer.result?.(result as any);
        }
        catch (err: any) {
          return Promise.reject(err);
        }
      })
      .catch((err: Error) => {
        if (this.config.signal.aborted) return observer.abort?.(this.config.signal.reason);
        observer.error?.(err);
      })
      .finally(() => observer.finish?.());
  }
}