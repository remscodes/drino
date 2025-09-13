import { fixChromiumAndWebkitTimeoutError, fixFirefoxAbortError } from '../features/abort/abort-util';
import type { HttpContext } from '../features/interceptors/context/http-context';
import { DEFAULT_HTTP_CONTEXT_CHAIN } from '../features/interceptors/context/http-context.constants';
import type { BeforeErrorArgs } from '../features/interceptors/models/interceptor.model';
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
    const { headers, read, wrapper, prefix, queryParams, baseUrl } = this.config;

    this.request = new HttpRequest({ method, url, body, headers, read, wrapper, prefix, queryParams, baseUrl });
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
    this.config.interceptors.beforeError = async (args: BeforeErrorArgs) => {
      await original(args);
      reportFn(args.errRes);
    };
    return this;
  }

  public finalize(finalFn: FinalCallback): RequestController<Resource> {
    const original = this.config.interceptors.beforeFinish;
    this.config.interceptors.beforeFinish = async (args) => {
      await original(args);
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
    const {
      abortCtrl,
      interceptors,
      context: contextChain,
      retry,
      fetch,
      credentials,
      mode,
      priority,
      cache,
      redirect,
      keepalive,
      referrerPolicy,
      integrity,
    } = this.config;

    const context: HttpContext = contextChain(DEFAULT_HTTP_CONTEXT_CHAIN());

    const tools: FetchTools = {
      abortCtrl,
      interceptors,
      retry,
      context: context,
      retryCb: observer?.retry,
      dlCb: observer?.download,
      fetch,
      fetchInit: {
        credentials,
        mode,
        priority,
        cache,
        redirect,
        keepalive,
        referrerPolicy,
        integrity,
      },
    };

    if (!observer) return this.makePromise(tools);
    this.useObserver(observer, tools);
  }

  /** @internal */
  private async makePromise(tools: FetchTools): Promise<Resource> {
    try {
      return await this.consumeAndGetResult(tools);
    }
    catch (err: unknown) {
      return this.reject(err);
    }
    finally {
      await this.config.interceptors.beforeFinish({ req: this.request, ctx: tools.context });
    }
  }

  /** @internal */
  private useObserver(observer: Observer<Resource>, tools: FetchTools): void {
    Promise.resolve().then(async () => {
      try {
        const result = await this.consumeAndGetResult(tools);
        observer.result?.(result);
      }
      catch (thrown: unknown) {
        const signal: AbortSignal = tools.abortCtrl.signal;
        if (signal.aborted) return observer.abort?.(signal.reason);

        const err = (this.config.abortCtrl.signal.aborted) ?
          (this.config.abortCtrl.signal.timeout) ? fixChromiumAndWebkitTimeoutError(thrown)
            : fixFirefoxAbortError(thrown)
          : thrown;

        observer.error?.(err);
      }
      finally {
        await this.config.interceptors.beforeFinish({ req: this.request, ctx: tools.context });
        observer.finish?.();
      }
    });
  }

  /** @internal */
  private async consumeAndGetResult(tools: FetchTools): Promise<Resource> {
    await this.config.interceptors.beforeConsume({ req: this.request, ctx: tools.context, abort: (r) => tools.abortCtrl.abort(r) });

    if (tools.abortCtrl.signal.aborted) throw tools.abortCtrl.signal.reason;

    let result = await performHttpRequest<Resource>(this.request, tools);
    for (const modifier of this.modifiers) result = await modifier(result);

    return result;
  }

  /** @internal */
  private reject(thrown: any): any {
    throw (this.config.abortCtrl.signal.aborted) ?
      (this.config.abortCtrl.signal.timeout) ? fixChromiumAndWebkitTimeoutError(thrown)
        : fixFirefoxAbortError(thrown)
      : thrown;
  }
}
