import { fixChromiumAndWebkitTimeoutError, fixFirefoxAbortError } from '../features/abort/abort-util';
import type { DrinoDefaultConfig } from '../models/drino.model';
import type { RequestMethodType, Url } from '../models/http.model';
import type { FetchTools } from './fetching';
import { performHttpRequest } from './fetching';
import { HttpRequest } from './http-request';
import type { RequestConfig } from './models';
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

  private readonly config: RequestControllerConfig;

  private readonly request: HttpRequest;

  private readonly modifiers: Modifier<any, any>[] = [];

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
      abortTools: this.config.abortTools,
      interceptors: this.config.interceptors,
      retry: this.config.retry,
      retryCb: observer?.retry,
      progress: this.config.progress,
      dlCb: observer?.downloadProgress,
      // ulCb: observer?.uploadProgress,
    };

    if (!observer) return this.thenable(tools);
    this.useObserver(observer, tools);
  }

  private async thenable(tools: FetchTools): Promise<Resource> {
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

  private useObserver(observer: Observer<Resource>, tools: FetchTools): void {
    performHttpRequest<Resource>(this.request, tools)
      .then(async (result) => {
        try {
          for (const modifier of this.modifiers) result = await modifier(result);
          observer.result?.(result);
        }
        catch (err: unknown) {
          return this.catchable(err);
        }
      })
      .catch((err: any) => {
        if (this.config.abortTools.signal.aborted) return observer.abort?.(this.config.abortTools.signal.reason);
        observer.error?.(err);
      })
      .finally(() => {
        this.config.interceptors.beforeFinish();
        observer.finish?.();
      });
  }

  private catchable(thrown: any): Promise<any> {
    const error: any = (this.config.abortTools.signal.aborted) ?
      (this.config.abortTools.signal.abortedByTimeout) ? fixChromiumAndWebkitTimeoutError(thrown)
        : fixFirefoxAbortError(thrown)
      : thrown;

    return Promise.reject(error);
  }
}
