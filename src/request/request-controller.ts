import type { PipeFunction } from '../features';
import { fixChromiumAndWebkitTimeoutError, fixFirefoxAbortError } from '../features/abort/abort-util';
import type { HttpContext } from '../features/interceptors/context/http-context';
import { DEFAULT_HTTP_CONTEXT_CHAIN } from '../features/interceptors/context/http-context.constants';
import type { DrinoParentConfig } from '../models/drino.model';
import type { RequestMethodType, Url } from '../models/http.model';
import { performHttpRequest } from './fetching';
import { HttpRequest } from './http-request';
import type { RequestConfig } from './models';
import type { FetchTools } from './models/fetch-tools.model';
import type { Modifier, Observer, RequestControllerConfig } from './models/request-controller.model';
import { mergeRequestConfigs } from './request-util';

interface DrinoRequestInit {
  method: RequestMethodType;
  url: Url;
  body?: any;
  config?: RequestConfig<any, any>;
}

export class RequestController<Resource> {

  /**
   * Adds a modifier to the transformation chain.
   * The modifier will be applied when consume() is called.
   * Creates a new RequestController instance (immutable operation).
   * @param modifier - Transformation function to apply to the result
   * @returns new instance with the modifier added
   * @internal (only called by pipe operators)
   */
  public addModifier<NewResource>(modifier: Modifier<Resource, NewResource>): RequestController<NewResource> {
    const cloned = this.clone<NewResource>();
    cloned.modifiers.push(modifier);
    return cloned;
  }

  /**
   * Adds an observer to the observer chain.
   * Creates a new RequestController instance (immutable operation).
   * @param observer - Observer callbacks to add
   * @returns new instance with the observer added
   * @internal (only called by pipe operators)
   */
  public addObserver(observer: Partial<Observer<Resource>>): RequestController<Resource> {
    const cloned = this.clone();

    this.mergeCallback(cloned.observerChain, observer, 'result');
    this.mergeCallback(cloned.observerChain, observer, 'error');
    this.mergeCallback(cloned.observerChain, observer, 'finish');
    this.mergeCallback(cloned.observerChain, observer, 'abort');
    this.mergeCallback(cloned.observerChain, observer, 'retry');
    this.mergeCallback(cloned.observerChain, observer, 'download');

    return cloned;
  }

  /**
   * Merges a callback from the new observer into the existing observer chain
   * @internal
   */
  private mergeCallback<K extends keyof Observer<Resource>>(
    target: Partial<Observer<Resource>>,
    source: Partial<Observer<Resource>>,
    key: K
  ): void {
    if (!source[key]) return;

    const existing = target[key];
    const newCallback = source[key];

    if (existing) {
      target[key] = ((...args: any[]) => {
        (existing as any)(...args);
        (newCallback as any)(...args);
      }) as any;
    } else {
      target[key] = newCallback;
    }
  }

  /**
   * Creates a shallow clone of this RequestController.
   * Copies modifiers and observer chain to the new instance.
   * @internal
   */
  private clone<NewResource = Resource>(): RequestController<NewResource> {
    const cloned = new RequestController<NewResource>(this.init as any, this.defaultConfig);
    cloned.modifiers.push(...this.modifiers);
    Object.assign(cloned.observerChain, this.observerChain);
    return cloned;
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

  public readonly request: HttpRequest<Resource>;

  /**
   * Pipe operators style RxJS. Allows chaining of PipeFunction operators.
   * Returns a new RequestController instance (immutable operation).
   * @example
   * const base = drino.get('/users');
   * const transformed = base.pipe(mapResult(x => x * 2));
   * // base and transformed are independent instances
   */
  public pipe(): this;
  public pipe<NewResource>(op1: PipeFunction<Resource, NewResource>): RequestController<NewResource>;
  public pipe<A, B>(op1: PipeFunction<Resource, A>, op2: PipeFunction<A, B>): RequestController<B>;
  public pipe<A, B, C>(op1: PipeFunction<Resource, A>, op2: PipeFunction<A, B>, op3: PipeFunction<B, C>): RequestController<C>;
  public pipe<A, B, C, D>(op1: PipeFunction<Resource, A>, op2: PipeFunction<A, B>, op3: PipeFunction<B, C>, op4: PipeFunction<C, D>): RequestController<D>;
  public pipe<A, B, C, D, E>(op1: PipeFunction<Resource, A>, op2: PipeFunction<A, B>, op3: PipeFunction<B, C>, op4: PipeFunction<C, D>, op5: PipeFunction<D, E>): RequestController<E>;
  public pipe(...operators: PipeFunction<any, any>[]): RequestController<any> {
    if (operators.length === 0) return this;
    return operators.reduce((source, operator) => operator(source), this as RequestController<any>);
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
    }
    else {
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
