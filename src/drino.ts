import { DrinoInstance } from './drino-instance';
import { DrinoRequest } from './drino-request';
import type { RequestMethodType } from './models/http.model';
import type { Options, ReadType, ReadTypeMap } from './models/options.model';

export default class Drino {

  private static create(): DrinoInstance {
    return new DrinoInstance();
  }

  private static extend(drino: DrinoInstance): DrinoInstance {
    return new DrinoInstance(drino);
  }

  public static request<T, Read extends ReadType = 'response'>(method: RequestMethodType, url: string, body: any, options?: Options<Read>): DrinoRequest<T, Read> {
    return new DrinoRequest({ method, url, body, options });
  }

  public static get<T, Read extends ReadType = 'response', R = (T extends unknown ? ReadTypeMap[Read] : T)>(url: string, options?: Options<Read>): DrinoRequest<T, Read> {
    return this.request('GET', url, null, options);
  }

  public static head<T, Read extends ReadType = 'response'>(url: string, options?: Options<Read>): DrinoRequest<T, Read> {
    return this.request('HEAD', url, null, options);
  }

  public static delete<T, Read extends ReadType = 'response'>(url: string, options?: Options<Read>): DrinoRequest<T, Read> {
    return this.request('DELETE', url, null, options);
  }

  public static options<T, Read extends ReadType = 'response'>(url: string, options?: Options<Read>): DrinoRequest<T, Read> {
    return this.request('OPTIONS', url, null, options);
  }

  public static post<T, Read extends ReadType = 'response'>(url: string, body: any, options?: Options<Read>):DrinoRequest<T, Read> {
    return this.request('POST', url, body, options);
  }

  public static put<T, Read extends ReadType = 'response'>(url: string, body: any, options?: Options<Read>): DrinoRequest<T, Read> {
    return this.request('PUT', url, body, options);
  }

  public static patch<T, Read extends ReadType = 'response'>(url: string, body: any, options?: Options<Read>): DrinoRequest<T, Read> {
    return this.request('PATCH', url, body, options);
  }
}
