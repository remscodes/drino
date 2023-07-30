import { DrinoInstance } from './drino-instance';
import { DrinoRequest } from './drino-request';
import { RequestMethodType } from './models/http.model';
import { Options } from './models/options.model';

export default class Drino {

  public static create(): DrinoInstance {
    return new DrinoInstance();
  }

  public static extend(drino: DrinoInstance): DrinoInstance {
    return new DrinoInstance(drino);
  }

  public static request(method: RequestMethodType, url: string, data: any, options?: Options) {
    return new DrinoRequest(method, url, data, options);
  }

  public static get<T>(url: string, options?: Options): DrinoRequest<T> {
    return new DrinoRequest<T>('GET', url, undefined, options);
  }
}
