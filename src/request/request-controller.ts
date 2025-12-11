import type { PipeFunction } from '../features';
import { fixChromiumAndWebkitTimeoutError, fixFirefoxAbortError } from '../features/abort/abort-util';
import type { HttpContext } from '../features/interceptors/context/http-context';
import { DEFAULT_HTTP_CONTEXT_CHAIN } from '../features/interceptors/context/http-context.constants';
import type { BeforeErrorArgs } from '../features/interceptors/models/interceptor.model';
import type { DrinoParentConfig } from '../models/drino.model';
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

  public clone<NewResource = Resource>(): RequestController<NewResource> {
    const cloned = new RequestController<NewResource>(this.init, this.defaultConfig);

    // Copy-on-Write optimization: share references instead of copying
    (cloned as any).modifiers = this.modifiers;
    (cloned as any).observerChain = this.observerChain;

    // Mark both instances as sharing state
    (cloned as any).modifiersOwned = false;
    (cloned as any).observerChainOwned = false;
    this.modifiersOwned = false;
    this.observerChainOwned = false;

    return cloned;
  }

  /**
   * Ensures modifiers array is uniquely owned before mutation
   * @internal
   */
  private ensureModifiersOwned(): void {
    if (!this.modifiersOwned) {
      (this as any).modifiers = [...this.modifiers];
      this.modifiersOwned = true;
    }
  }

  /**
   * Ensures observerChain is uniquely owned before mutation
   * @internal
   */
  private ensureObserverChainOwned(): void {
    if (!this.observerChainOwned) {
      (this as any).observerChain = { ...this.observerChain };
      this.observerChainOwned = true;
    }
  }

  /** @internal */
  public addObserver(observer: Partial<Observer<Resource>>): void {
    // Copy-on-write: ensure we own observerChain before mutating
    this.ensureObserverChainOwned();

    // Merge observer callbacks
    if (observer.result) {
      const existingResult = this.observerChain.result;
      const newResult = observer.result;
      this.observerChain.result = existingResult
        ? (res) => { existingResult(res); newResult(res); }
        : newResult;
    }

    if (observer.error) {
      const existingError = this.observerChain.error;
      const newError = observer.error;
      this.observerChain.error = existingError
        ? (err) => { existingError(err); newError(err); }
        : newError;
    }

    if (observer.finish) {
      const existingFinish = this.observerChain.finish;
      const newFinish = observer.finish;
      this.observerChain.finish = existingFinish
        ? () => { existingFinish(); newFinish(); }
        : newFinish;
    }

    if (observer.abort) {
      const existingAbort = this.observerChain.abort;
      const newAbort = observer.abort;
      this.observerChain.abort = existingAbort
        ? (reason) => { existingAbort(reason); newAbort(reason); }
        : newAbort;
    }

    if (observer.retry) {
      const existingRetry = this.observerChain.retry;
      const newRetry = observer.retry;
      this.observerChain.retry = existingRetry
        ? (ev) => { existingRetry(ev); newRetry(ev); }
        : newRetry;
    }

    if (observer.download) {
      const existingDownload = this.observerChain.download;
      const newDownload = observer.download;
      this.observerChain.download = existingDownload
        ? (ev) => { existingDownload(ev); newDownload(ev); }
        : newDownload;
    }
  }

  public constructor(init: DrinoRequestInit, defaultConfig: DrinoParentConfig) {
    this.init = init;
    this.defaultConfig = defaultConfig;

    const { method, url, body = null, config = {} } = init;

    this.config = mergeRequestConfigs(config, defaultConfig);
    const { headers, read, wrapper, prefix, queryParams, baseUrl } = this.config;

    this.request = new HttpRequest({ method, url, body, headers, read, wrapper, prefix, queryParams, baseUrl });
  }

  /** @internal */
  private readonly init: DrinoRequestInit;

  /** @internal */
  private readonly defaultConfig: DrinoParentConfig;

  /** @internal */
  private readonly config: RequestControllerConfig;

  /** @internal */
  private readonly modifiers: Modifier<any, any>[] = [];

  /** @internal */
  private readonly observerChain: Partial<Observer<Resource>> = {};

  /**
   * Tracks whether this instance owns the modifiers array (true) or shares it with clones (false)
   * @internal
   */
  private modifiersOwned = true;

  /**
   * Tracks whether this instance owns the observerChain object (true) or shares it with clones (false)
   * @internal
   */
  private observerChainOwned = true;

  public readonly request: HttpRequest<Resource>;

  /**
   * Pipe operators style RxJS. Allows chaining of PipeFunction operators.
   * @example
   * request.pipe(
   *   mapResult(x => x * 2),
   *   reportError(err => console.error(err))
   * )
   */
  public pipe(): RequestController<Resource>;
  public pipe<NewResource>(op1: PipeFunction<Resource, NewResource>): RequestController<NewResource>;
  public pipe<A, B>(op1: PipeFunction<Resource, A>, op2: PipeFunction<A, B>): RequestController<B>;
  public pipe<A, B, C>(op1: PipeFunction<Resource, A>, op2: PipeFunction<A, B>, op3: PipeFunction<B, C>): RequestController<C>;
  public pipe<A, B, C, D>(op1: PipeFunction<Resource, A>, op2: PipeFunction<A, B>, op3: PipeFunction<B, C>, op4: PipeFunction<C, D>): RequestController<D>;
  public pipe<A, B, C, D, E>(op1: PipeFunction<Resource, A>, op2: PipeFunction<A, B>, op3: PipeFunction<B, C>, op4: PipeFunction<C, D>, op5: PipeFunction<D, E>): RequestController<E>;
  public pipe(...operators: PipeFunction<any, any>[]): RequestController<any> {
    if (operators.length === 0) return this;

    return operators.reduce((source, operator) => operator(source), this as RequestController<any>);
  }

  /**
   * @deprecated
   */
  public transform<NewResource>(modifier: Modifier<Resource, NewResource>): RequestController<NewResource>;
  public transform(modifiers: Modifier<any, any>): RequestController<any> {
    this.ensureModifiersOwned();
    this.modifiers.push(modifiers);
    return this;
  }

  /**
   * @deprecated
   */
  public check(checkFn: CheckCallback<Resource>): RequestController<Resource> {
    this.ensureModifiersOwned();
    this.modifiers.push((result: Resource) => {
      checkFn(result);
      return result;
    });
    return this;
  }

  /**
   * @deprecated
   */
  public report(reportFn: ReportCallback): RequestController<Resource> {
    const original = this.config.interceptors.beforeError;
    this.config.interceptors.beforeError = async (args: BeforeErrorArgs) => {
      await original(args);
      reportFn(args.errRes);
    };
    return this;
  }

  /**
   * @deprecated
   */
  public finalize(finalFn: FinalCallback): RequestController<Resource> {
    const original = this.config.interceptors.beforeFinish;
    this.config.interceptors.beforeFinish = async (args) => {
      await original(args);
      finalFn();
    };
    return this;
  }

  /**
   * @deprecated
   */
  public follow<NewResource>(followFn: FollowCallback<Resource, NewResource>): RequestController<NewResource>;
  public follow(followFn: FollowCallback<any, any>): RequestController<any> {
    this.ensureModifiersOwned();
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

    // Merge the observer chain with the passed observer
    const mergedObserver = this.mergeObservers(observer);

    const tools: FetchTools = {
      abortCtrl,
      interceptors,
      retry,
      context,
      retryCb: mergedObserver?.retry,
      dlCb: mergedObserver?.download,
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

    if (!observer && Object.keys(this.observerChain).length === 0) {
      return this.makePromise(tools);
    }

    if (!observer) {
      // Use observerChain as observer
      this.useObserver(this.observerChain as Observer<Resource>, tools);
    } else {
      this.useObserver(mergedObserver!, tools);
    }
  }

  /** @internal */
  private mergeObservers(observer?: Observer<Resource>): Observer<Resource> | undefined {
    if (!observer && Object.keys(this.observerChain).length === 0) return undefined;
    if (!observer) return this.observerChain as Observer<Resource>;
    if (Object.keys(this.observerChain).length === 0) return observer;

    // Merge both observers
    const merged: Partial<Observer<Resource>> = {};

    if (this.observerChain.result || observer.result) {
      merged.result = (res) => {
        this.observerChain.result?.(res);
        observer.result?.(res);
      };
    }

    if (this.observerChain.error || observer.error) {
      merged.error = (err) => {
        this.observerChain.error?.(err);
        observer.error?.(err);
      };
    }

    if (this.observerChain.finish || observer.finish) {
      merged.finish = () => {
        this.observerChain.finish?.();
        observer.finish?.();
      };
    }

    if (this.observerChain.abort || observer.abort) {
      merged.abort = (reason) => {
        this.observerChain.abort?.(reason);
        observer.abort?.(reason);
      };
    }

    if (this.observerChain.retry || observer.retry) {
      merged.retry = (ev) => {
        this.observerChain.retry?.(ev);
        observer.retry?.(ev);
      };
    }

    if (this.observerChain.download || observer.download) {
      merged.download = (ev) => {
        this.observerChain.download?.(ev);
        observer.download?.(ev);
      };
    }

    return merged as Observer<Resource>;
  }

  /** @internal */
  private async makePromise(tools: FetchTools): Promise<Resource> {
    try {
      return await this.consumeAndGetResult(tools);
    }
    catch (err: unknown) {
      throw this.reject(err);
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

        const err = this.reject(thrown);

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
    return (this.config.abortCtrl.signal.aborted) ?
      (this.config.abortCtrl.signal.timeout) ? fixChromiumAndWebkitTimeoutError(thrown)
        : fixFirefoxAbortError(thrown)
      : thrown;
  }
}
