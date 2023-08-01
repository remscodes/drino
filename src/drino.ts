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

  public static request(method: RequestMethodType, url: string, body: any, options?: Options) {
    return new DrinoRequest({ method, url, body, options });
  }

  public static get<T>(url: string, options?: Options): DrinoRequest<T> {
    return new DrinoRequest<T>({ method: 'GET', url, options });
  }

  public static head<T>(url: string, options?: Options): DrinoRequest<T> {
    return new DrinoRequest<T>({ method: 'HEAD', url, options });
  }

  public static delete<T>(url: string, options?: Options): DrinoRequest<T> {
    return new DrinoRequest<T>({ method: 'DELETE', url, options });
  }

  public static options<T>(url: string, options?: Options): DrinoRequest<T> {
    return new DrinoRequest<T>({ method: 'OPTIONS', url, options });
  }

  public static post<T>(url: string, body: any, options?: Options): DrinoRequest<T> {
    return new DrinoRequest<T>({ method: 'POST', url, body, options });
  }

  public static put<T>(url: string, body: any, options?: Options): DrinoRequest<T> {
    return new DrinoRequest<T>({ method: 'PUT', url, body, options });
  }

  public static patch<T>(url: string, body: any, options?: Options): DrinoRequest<T> {
    return new DrinoRequest<T>({ method: 'PATCH', url, body, options });
  }
}
