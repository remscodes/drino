import { DrinoInstance } from './drino-instance';
import { DrinoRequest } from './drino-request';
import type { RequestMethodType } from './models/http.model';
import type { Options } from './models/options.model';

export default class Drino {

  private static create(): DrinoInstance {
    return new DrinoInstance();
  }

  private static extend(drino: DrinoInstance): DrinoInstance {
    return new DrinoInstance(drino);
  }

  public static request<T>(method: RequestMethodType, url: string, body: any, options?: Options): DrinoRequest<T> {
    return new DrinoRequest<T>({ method, url, body, options });
  }

  public static get<T>(url: string, options?: Options): DrinoRequest<T> {
    return this.request('GET', url, undefined, options);
  }

  public static head<T>(url: string, options?: Options): DrinoRequest<T> {
    return this.request('HEAD', url, undefined, options);
  }

  public static delete<T>(url: string, options?: Options): DrinoRequest<T> {
    return this.request('DELETE', url, undefined, options);
  }

  public static options<T>(url: string, options?: Options): DrinoRequest<T> {
    return this.request('OPTIONS', url, undefined, options);
  }

  public static post<T>(url: string, body: any, options?: Options): DrinoRequest<T> {
    return this.request('POST', url, body, options);
  }

  public static put<T>(url: string, body: any, options?: Options): DrinoRequest<T> {
    return this.request('PUT', url, body, options);
  }

  public static patch<T>(url: string, body: any, options?: Options): DrinoRequest<T> {
    return this.request('PATCH', url, body, options);
  }
}
