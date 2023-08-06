import { DrinoInstance } from './drino-instance';
import { DrinoRequest } from './drino-request';
import type { RequestMethodType } from './models/http.model';
import type { InferReadType, Config, ReadType } from '@_/models/config.model';

export default class Drino {

  private static abortCtrl: AbortController = new AbortController();

  public static default = {
    config: {
      read: 'json',
      signal: this.abortCtrl.signal
    }
  };

  public static abort(reason: any): void {
    this.abortCtrl.abort(reason);
  }

  private static create(): DrinoInstance {
    return new DrinoInstance();
  }

  private static extend(drino: DrinoInstance): DrinoInstance {
    return new DrinoInstance(drino);
  }

  public static request<T, Read extends ReadType = InferReadType<T>>(method: RequestMethodType, url: string, body: any, config?: Config<Read>): DrinoRequest<T, Read> {
    return new DrinoRequest<T, Read>({ method, url, body, config });
  }

  public static get<T, Read extends ReadType = InferReadType<T>>(url: string, config?: Config<Read>): DrinoRequest<T, Read> {
    return this.request('GET', url, null, config);
  }

  public static head<T, Read extends ReadType = InferReadType<T>>(url: string, config?: Config<Read>): DrinoRequest<T, Read> {
    return this.request('HEAD', url, null, config);
  }

  public static delete<T, Read extends ReadType = InferReadType<T>>(url: string, config?: Config<Read>): DrinoRequest<T, Read> {
    return this.request('DELETE', url, null, config);
  }

  public static options<T, Read extends ReadType = InferReadType<T>>(url: string, config?: Config<Read>): DrinoRequest<T, Read> {
    return this.request('OPTIONS', url, null, config);
  }

  public static post<T, Read extends ReadType = InferReadType<T>>(url: string, body: any, config?: Config<Read>): DrinoRequest<T, Read> {
    return this.request('POST', url, body, config);
  }

  public static put<T, Read extends ReadType = InferReadType<T>>(url: string, body: any, config?: Config<Read>): DrinoRequest<T, Read> {
    return this.request('PUT', url, body, config);
  }

  public static patch<T, Read extends ReadType = InferReadType<T>>(url: string, body: any, config?: Config<Read>): DrinoRequest<T, Read> {
    return this.request('PATCH', url, body, config);
  }
}
