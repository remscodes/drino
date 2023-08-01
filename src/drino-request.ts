import type { RequestMethodType } from './models/http.model';
import type { Modifier } from './models/modifier.model';
import type { Observer } from './models/observer.model';
import type { Options } from './models/options.model';

interface DrinoRequestInit {
  method: RequestMethodType;
  url: string;
  body?: any;
  options?: Options;
}

export class DrinoRequest<T> {

  public constructor(init: DrinoRequestInit) {
    this.method = init.method;
    this.url = init.url;
    this.body = init.body;
    this.options = init.options ?? {};
  }

  private readonly method: RequestMethodType;
  private readonly url: string;
  private readonly body: any;
  private readonly options: Options;

  private readonly modifiers: Modifier<any, any>[] = [];

  public pipe(): DrinoRequest<T>;
  public pipe<A, B>(modifier: Modifier<A, B>): DrinoRequest<B>;
  public pipe(...modifiers: Modifier<any, any>[]): DrinoRequest<any> {
    this.modifiers.push(...modifiers);
    return this;
  }

  public consume(): Promise<T>;
  public consume(observer: Observer<T>): void;
  public consume(observer?: Observer<T>): Promise<T> | void {
    if (!observer) return this.thenable();
    this.useObserver(observer);
  }

  private buildUrl(): URL {
    const { prefix, params } = this.options;

    let baseUrl = this.url;
    if (params && Object.keys(params).length > 0) {
      const searchParams: URLSearchParams = new URLSearchParams(params as (Record<string, string> | undefined));
      baseUrl = `${baseUrl}?${searchParams}`;
    }

    return new URL(baseUrl, prefix);
  }

  private async thenable(): Promise<T> {
    try {
      const res: Response = await this.useFetch();
      return await res.json();
    } catch (err) {
      throw err;
    }
  }

  private useObserver(observer: Observer<T>): void {
    this.useFetch()
      .then(async (res: Response) => {
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const data = await res.json();
        if (!res.ok) {
          return Promise.reject(data);
        }
        return this.modifiers.reduce((_, modifier) => modifier(data), data);
      })
      .then((result: T) => {
        observer.result?.(result);
        return result;
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') {
          return observer.abort?.(err);
        }
        observer.error?.(err);
      })
      .finally(() => {
        observer.finish?.();
      });
  }

  private useFetch(): Promise<Response> {
    return fetch(this.buildUrl(), {
      method: this.method,
      headers: this.options.headers,
      body: this.body,
      signal: this.options.signal
    });
  }
}
