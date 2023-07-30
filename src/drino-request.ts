import { RequestMethodType } from './models/http.model';
import { Modifier } from './models/modifier.model';
import { Observer } from './models/observer.model';
import { Options } from './models/options.model';

export class DrinoRequest<T = any> {

  public constructor(
    private method: RequestMethodType,
    private url: string,
    private data: any,
    private options: Options = {}
  ) { }

  private modifiers: Modifier<any, any>[] = [];

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

  private get fetchInit(): RequestInit {
    return {
      signal: this.options.signal,
      method: this.method.toLowerCase()
    };
  }

  private async thenable(): Promise<T> {
    const res = await fetch(this.url, this.fetchInit);
    return await res.json();
  }

  private useObserver(observer: Observer<T>): void {
    fetch(this.url, this.fetchInit)
      .then(async (res: Response) => {
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const data = await res.json();
        if (!res.ok) {
          return Promise.reject(data);
        }
        return this.modifiers.reduce((_, modifier) => modifier(data), data);
      })
      .then((result: T) => {
        observer.success?.(result);
        observer.result?.(result);
        return result;
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') {
          return observer.aborted?.(err);
        }
        observer.error?.(err);
      })
      .finally(() => {
        observer.finished?.();
      });
  }
}
