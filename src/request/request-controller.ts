import { fixChromiumAndWebkitTimeoutError, fixFirefoxAbortError } from '../features/abort/abort-util';
import type { DrinoDefaultConfig } from '../models/drino.model';
import type { RequestMethodType, Url } from '../models/http.model';
import { performHttpRequest } from './fetching';
import { HttpRequest } from './http-request';
import type { RequestConfig } from './models';
import type { FetchTools } from './models/fetch-tools.model';
import type { CheckCallback, FinalCallback, FollowCallback, Modifier, Observer, ReportCallback, RequestControllerConfig } from './models/request-controller.model';
import { mergeRequestConfigs } from './request-util';

interface DrinoRequestInit {
  method: RequestMethodType;
  url: Url;
  body?: any;
  config?: RequestConfig<any, any>;
}

export class RequestController<Resource> {

  public constructor(init: DrinoRequestInit, defaultConfig: DrinoDefaultConfig) {
    const { method, url, body, config = {} } = init;

    this.config = mergeRequestConfigs(config, defaultConfig);

    // Disable upload for http methods without body
    // if (!method.startsWith('P')) this.config.progress.upload.inspect = false;

    this.request = new HttpRequest({
      method,
      url,
      body,
      headers: this.config.headers,
      read: this.config.read,
      wrapper: this.config.wrapper,
      prefix: this.config.prefix,
      queryParams: this.config.queryParams,
      baseUrl: this.config.baseUrl,
    });
  }

  /** @internal */
  private readonly config: RequestControllerConfig;

  /** @internal */
  private readonly modifiers: Modifier<any, any>[] = [];

  public readonly request: HttpRequest<Resource>;

  public transform<NewResource>(modifier: Modifier<Resource, NewResource>): RequestController<NewResource>;
  public transform(modifiers: Modifier<any, any>): RequestController<any> {
    this.modifiers.push(modifiers);
    return this;
  }

  public check(checkFn: CheckCallback<Resource>): RequestController<Resource> {
    this.modifiers.push((result: Resource) => {
      checkFn(result);
      return result;
    });
    return this;
  }

  public report(reportFn: ReportCallback): RequestController<Resource> {
    const original = this.config.interceptors.beforeError;
    this.config.interceptors.beforeError = (err: any) => {
      original(err);
      reportFn(err);
    };
    return this;
  }

  public finalize(finalFn: FinalCallback): RequestController<Resource> {
    const original = this.config.interceptors.beforeFinish;
    this.config.interceptors.beforeFinish = () => {
      original();
      finalFn();
    };
    return this;
  }

  public follow<NewResource>(followFn: FollowCallback<Resource, NewResource>): RequestController<NewResource>;
  public follow(followFn: FollowCallback<any, any>): RequestController<any> {
    this.modifiers.push((result: Resource) => followFn(result).consume());
    return this;
  }

  public consume(): Promise<Resource>;
  public consume(observer: Observer<Resource>): void;
  public consume(observer?: Observer<Resource>): Promise<Resource> | void {
    this.config.interceptors.beforeConsume(this.request);

    const tools: FetchTools = {
      abortCtrl: this.config.abortCtrl,
      interceptors: this.config.interceptors,
      retry: this.config.retry,
      retryCb: observer?.retry,
      progress: this.config.progress,
      dlCb: observer?.download,
      // ulCb: observer?.uploadProgress,
      fetch: this.config.fetch,
      fetchInit: {
        credentials: this.config.credentials,
        mode: this.config.mode,
        priority: this.config.priority,
        cache: this.config.cache,
        redirect: this.config.redirect,
        keepalive: this.config.keepalive,
        referrerPolicy: this.config.referrerPolicy,
        integrity: this.config.integrity,
      },
    };

    if (!observer) return this.makePromise(tools);
    this.useObserver(observer, tools);
  }

  /** @internal */
  private async makePromise(tools: FetchTools): Promise<Resource> {
    try {
      let result = await performHttpRequest<Resource>(this.request, tools);
      for (const modifier of this.modifiers) result = await modifier(result);
      return result;
    }
    catch (err: unknown) {
      return this.reject(err);
    }
    finally {
      this.config.interceptors.beforeFinish();
    }
  }

  /** @internal */
  private useObserver(observer: Observer<Resource>, tools: FetchTools): void {
    performHttpRequest<Resource>(this.request, tools)
      .then(async (result) => {
        try {
          for (const modifier of this.modifiers) result = await modifier(result);
          observer.result?.(result);
        }
        catch (err: unknown) {
          return this.reject(err);
        }
      })
      .catch((err: any) => {
        const signal: AbortSignal = this.config.abortCtrl.signal;
        if (signal.aborted) return observer.abort?.(signal.reason);

        observer.error?.(err);
      })
      .finally(() => {
        this.config.interceptors.beforeFinish();
        observer.finish?.();
      });
  }

  /** @internal */
  private reject(thrown: any): Promise<any> {
    const error: any = (this.config.abortCtrl.signal.aborted) ?
      (this.config.abortCtrl.signal.abortedByTimeout) ? fixChromiumAndWebkitTimeoutError(thrown)
        : fixFirefoxAbortError(thrown)
      : thrown;

    return Promise.reject(error);
  }
}
