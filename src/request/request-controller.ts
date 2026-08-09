import { Pipeline } from '../features';
import { fixChromiumAndWebkitTimeoutError, fixFirefoxAbortError } from '../features/abort/abort-util';
import type { HttpContext } from '../features/interceptors/context/http-context';
import { DEFAULT_HTTP_CONTEXT_CHAIN } from '../features/interceptors/context/http-context.constants';
import type { DrinoParentConfig } from '../models/drino.model';
import type { RequestMethodType, Url } from '../models/http.model';
import { mergeCallback } from '../utils/fn-util';
import { performHttpRequest } from './fetching';
import { HttpRequest } from './http-request';
import type { RequestConfig } from './models';
import type { FetchTools } from './models/fetch-tools.model';
import type { Mapper, Observer, ObserverChain, RequestControllerConfig } from './models/request-controller.model';
import { mergeRequestConfigs } from './request-util';

type ObserverEventKey = Exclude<keyof Observer, 'result'>

/**
 * Observer keys forwarded as callbacks.
 *
 * `result` is excluded: chain results are mappers applied in `consumeAndGetResult`.
 *
 * Must be kept in sync with `Observer`.
 * @internal
 */
const OBSERVER_EVENT_KEYS: ObserverEventKey[] = ['error', 'finish', 'abort', 'retry', 'download'];

export class RequestController<Resource> {

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
  private readonly chains: ObserverChain<any, any>[] = [];

  public readonly request: HttpRequest<Resource>;

  /**
   * Creates a shallow clone.
   * @internal
   */
  private clone<NewResource = Resource>(): RequestController<NewResource> {
    const cloned = new RequestController<NewResource>(this.init, this.defaultConfig);
    cloned.chains.push(...this.chains);
    return cloned;
  }

  public addMapper<NewResource>(mapper: Mapper<Resource, NewResource>): RequestController<NewResource> {
    const cloned = this.clone<NewResource>();
    cloned.chains.push({ result: mapper });
    return cloned;
  }

  public addObserver(observer: Partial<Observer<Resource>>): RequestController<Resource> {
    const cloned = this.clone();

    // Create a pipeline step that observes but returns the value unchanged
    const step: Partial<ObserverChain<Resource, Resource>> = {};

    if (observer.result) {
      const observerResult = observer.result;
      step.result = (res: Resource) => {
        observerResult(res);
        return res;
      };
    }

    if (observer.error) {
      const observerError = observer.error;
      step.error = (err: any) => {
        observerError(err);
        return err;
      };
    }

    if (observer.finish) step.finish = observer.finish;
    if (observer.abort) step.abort = observer.abort;
    if (observer.retry) step.retry = observer.retry;
    if (observer.download) step.download = observer.download;

    cloned.chains.push(step);
    return cloned;
  }

  public pipe(): this;
  public pipe<NewResource>(op: Pipeline<Resource, NewResource>): RequestController<NewResource>;
  public pipe<A, B>(op1: Pipeline<Resource, A>, op2: Pipeline<A, B>): RequestController<B>;
  public pipe<A, B, C>(op1: Pipeline<Resource, A>, op2: Pipeline<A, B>, op3: Pipeline<B, C>): RequestController<C>;
  public pipe<A, B, C, D>(op1: Pipeline<Resource, A>, op2: Pipeline<A, B>, op3: Pipeline<B, C>, op4: Pipeline<C, D>): RequestController<D>;
  public pipe<A, B, C, D, E>(op1: Pipeline<Resource, A>, op2: Pipeline<A, B>, op3: Pipeline<B, C>, op4: Pipeline<C, D>, op5: Pipeline<D, E>): RequestController<E>;
  public pipe<A, B, C, D, E, F>(op1: Pipeline<Resource, A>, op2: Pipeline<A, B>, op3: Pipeline<B, C>, op4: Pipeline<C, D>, op5: Pipeline<D, E>, op6: Pipeline<E, F>): RequestController<F>;
  public pipe(...operators: Pipeline<any, any>[]): RequestController<any> {
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

    const finalObserver = this.mergeWithChain(observer);

    const tools: FetchTools = {
      abortCtrl,
      interceptors,
      retry,
      context,
      retryCb: finalObserver.retry,
      dlCb: finalObserver.download,
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

    if (!observer) return this.makePromise(tools, finalObserver);
    this.useObserver(finalObserver, tools);
  }

  /**
   * Collects all observer callbacks from the pipeline and merges with the passed observer.
   * @internal
   */
  private mergeWithChain(observer?: Observer<Resource>): Partial<Observer<Resource>> {
    const finalObserver: Partial<Observer<Resource>> = {};

    for (const chain of this.chains)
      for (const key of OBSERVER_EVENT_KEYS) mergeCallback(finalObserver, chain, key);

    if (observer) {
      for (const key of Object.keys(observer) as (keyof Observer)[]) {
        mergeCallback(finalObserver, observer, key);
      }
    }

    return finalObserver;
  }

  /** @internal */
  private async makePromise(tools: FetchTools, observer: Partial<Observer<Resource>>): Promise<Resource> {
    try {
      return await this.consumeAndGetResult(tools);
    }
    catch (thrown: unknown) {
      const signal = tools.abortCtrl.signal;
      const err = this.reject(thrown);

      if (signal.aborted) observer.abort?.(signal.reason);
      else observer.error?.(err);

      throw err;
    }
    finally {
      await this.config.interceptors.beforeFinish({ req: this.request, ctx: tools.context });
      observer.finish?.();
    }
  }

  /** @internal */
  private useObserver(observer: Partial<Observer<Resource>>, tools: FetchTools): void {
    Promise.resolve().then(async () => {
      try {
        const result = await this.consumeAndGetResult(tools);
        observer.result?.(result);
      }
      catch (thrown: unknown) {
        const signal = tools.abortCtrl.signal;
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

    const signal = tools.abortCtrl.signal;
    if (signal.aborted) throw signal.reason;

    let result = await performHttpRequest<Resource>(this.request, tools);

    for (const chain of this.chains) {
      if (!chain.result) continue;
      result = (await chain.result(result)) ?? result;
    }

    return result;
  }

  /** @internal */
  private reject(thrown: any): any {
    const signal = this.config.abortCtrl.signal;

    if (signal.aborted && signal.timeout)
      return fixChromiumAndWebkitTimeoutError(thrown);

    if (signal.aborted && !signal.timeout)
      return fixFirefoxAbortError(thrown);

    return thrown;
  }
}

interface DrinoRequestInit {
  method: RequestMethodType;
  url: Url;
  body?: any;
  config?: RequestConfig<any, any>;
}
