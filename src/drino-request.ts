import { DrinoResponse } from './drino-response';
import type { RequestMethodType } from './models/http.model';
import type { Modifier } from './models/modifier.model';
import type { Observer } from './models/observer.model';
import type { Options, ReadType, ReadTypeMap } from './models/options.model';

interface DrinoRequestInit<Read extends ReadType> {
  method: RequestMethodType;
  url: string;
  body?: any;
  options?: Options<Read>;
}

export class DrinoRequest<Resource, Read extends ReadType = 'response'> {

  public constructor(init: DrinoRequestInit<Read>) {
    const { method, url, body, options = {} } = init;

    this.method = method;
    this.url = url;
    this.body = body;
    this.options = options;
    // @ts-ignore
    this.read = options.read ?? 'response';

    const abortController = new AbortController();
    this.signal = options.signal ?? abortController.signal;
  }

  private readonly method: RequestMethodType;
  private readonly url: string;
  private readonly body: any;
  private readonly options: Options<Read>;

  private readonly read: Read;
  private readonly signal: AbortSignal;

  private readonly modifiers: Modifier[] = [];

  public pipe(): DrinoRequest<Resource, Read>;
  public pipe<A, B>(modifier: Modifier<A, B>): DrinoRequest<B, Read>;
  public pipe(...modifiers: Modifier[]): DrinoRequest<any, Read> {
    this.modifiers.push(...modifiers);
    return this;
  }

  public consume(): Promise<ReadTypeMap<Resource>[Read]>;
  public consume(observer: Observer<ReadTypeMap<Resource>[Read]>): void;
  public consume(observer?: Observer<ReadTypeMap<Resource>[Read]>): Promise<ReadTypeMap<Resource>[Read]> | void {
    if (!observer) return this.thenable();
    this.useObserver(observer);
  }

  private async thenable(): Promise<ReadTypeMap<Resource>[Read]> {
    let result: ReadTypeMap<Resource>[Read] = await this.processRequest();
    for (const modifier of this.modifiers) result = await modifier(result);
    return result;
  }

  private useObserver(observer: Observer<ReadTypeMap<Resource>[Read]>): void {
    const start: number = Date.now();
    this.processRequest()
      .then(async (result: ReadTypeMap<Resource>[Read]) => {
        for (const modifier of this.modifiers) result = await modifier(result);
        observer.result?.(result);
        return result;
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return observer.abort?.(err);
        observer.error?.(err);
      })
      .finally(() => {
        observer.finish?.(Date.now() - start);
      });
  }

  // private getParsedBody(res: DrinoResponse<Resource>): Promise<ReadTypeMap<Resource>[Read]> {
  //   const { readType } = res;
  //   return res.toJson();
  // return (readType === 'json') ? res.toJson()
  //   : (readType === 'blob') ? res.toBlob()
  //     : (readType === 'formData') ? res.toFormData()
  //       : (readType === 'arrayBuffer') ? res.toArrayBuffer()
  //         : res.toText();
  // };

  private async processRequest(): Promise<ReadTypeMap<Resource>[Read]> {
    const fetchResponse: Response = await this.useFetch();

    // const { headers, status, statusText, ok } = fetchResponse;
    if (!fetchResponse.ok) {
      return Promise.reject(fetchResponse.body);
    }

    return this.processReadType(fetchResponse);
    // return new DrinoResponse<Resource>({
    //   fetchResponse,
    //   headers,
    //   status,
    //   statusText,
    //   ok
    // });
  }

  private async processReadType(fetchResponse: Response) {
    const { headers, status, statusText, ok } = fetchResponse;

    if (this.read === 'json') return fetchResponse.json();
    else if (this.read === 'text') {
      return fetchResponse.text();
    }
    else if (this.read === 'blob') { // @ts-ignore
      return fetchResponse.blob();
    }
    else if (this.read === 'arrayBuffer') { // @ts-ignore
      return fetchResponse.arrayBuffer();
    }
    else if (this.read === 'formData') { // @ts-ignore
      return fetchResponse.formData();
    }
    return new DrinoResponse<Resource>({
      fetchResponse,
      headers,
      status,
      statusText,
      ok
    });
  }

  private useFetch(): Promise<Response> {
    const { headers, signal, withCredentials } = this.options;
    return fetch(this.buildUrl(), {
      method: this.method,
      body: this.body,
      headers,
      signal,
      credentials: (withCredentials) ? 'include' : 'omit'
    });
  }

  private buildUrl(): URL {
    const { prefix, queryParams } = this.options;

    let baseUrl = this.url;

    if (queryParams && (queryParams?.size || Object.keys(queryParams).length)) {
      const searchParams: URLSearchParams = (queryParams instanceof URLSearchParams)
        ? queryParams
        : new URLSearchParams(queryParams);

      baseUrl = `${baseUrl}?${searchParams}`;
    }

    return new URL(baseUrl, prefix);
  }
}
