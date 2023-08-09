import type { AnyRequestController, ArrayBufferRequestController, BlobRequestController, DrinoInstance, FormDataRequestController, ObjectRequestController, ResponseRequestController, StringRequestController } from './';
import type { Config } from './models/config.model';
import type { RequestMethodType, Url } from './models/http.model';
import { RequestController } from './request/request-controller';

export interface DefaultConfig {
  baseUrl?: Url;
  config?: Config<any>;
}

export class Drino {

  public constructor(config: DefaultConfig = {}, parent?: Drino) {
    this._defaultConfig = {
      ...parent?.defaultConfig ?? {},
      ...config
    };
    this._defaultConfig.config = {
      ...parent?.defaultConfig.config ?? {},
      ...config.config ?? {}
    };
  }

  private _defaultConfig: DefaultConfig;

  public get defaultConfig(): DefaultConfig {
    return this._defaultConfig;
  }

  public set defaultConfig(config: DefaultConfig) {
    this._defaultConfig = {
      ...this.defaultConfig,
      ...config
    };
  }

  public create(config: DefaultConfig = {}): DrinoInstance {
    return new Drino(config);
  }

  public child(config: DefaultConfig = {}): DrinoInstance {
    return new Drino(config, this);
  }

  private request<T>(method: RequestMethodType, url: Url, body: any, config?: Config<'object'>): ObjectRequestController<T>;
  private request<T>(method: RequestMethodType, url: Url, body: any, config?: Config<'response'>): ResponseRequestController<T>;
  private request<T>(method: RequestMethodType, url: Url, body: any, config?: Config<'blob'>): BlobRequestController<T>;
  private request<T>(method: RequestMethodType, url: Url, body: any, config?: Config<'arrayBuffer'>): ArrayBufferRequestController<T>;
  private request<T>(method: RequestMethodType, url: Url, body: any, config?: Config<'formData'>): FormDataRequestController<T>;
  private request<T>(method: RequestMethodType, url: Url, body: any, config?: Config<'string'>): StringRequestController<T>;
  private request<T>(method: RequestMethodType, url: Url, body: any, config?: Config<any>): AnyRequestController {
    return new RequestController<T>({ method, url, body, config }, this.defaultConfig);
  }

  public get<T>(url: Url, config?: Config<'object'>): ObjectRequestController<T>;
  public get<T>(url: Url, config?: Config<'response'>): ResponseRequestController<T>;
  public get<T>(url: Url, config?: Config<'blob'>): BlobRequestController<T>;
  public get<T>(url: Url, config?: Config<'arrayBuffer'>): ArrayBufferRequestController<T>;
  public get<T>(url: Url, config?: Config<'formData'>): FormDataRequestController<T>;
  public get<T>(url: Url, config?: Config<'string'>): StringRequestController<T>;
  public get<T>(url: Url, config?: Config<any>): AnyRequestController {
    return this.request<T>('GET', url, null, config);
  }

  public head<T>(url: Url, config?: Config<'object'>): ObjectRequestController<T>;
  public head<T>(url: Url, config?: Config<'response'>): ResponseRequestController<T>;
  public head<T>(url: Url, config?: Config<'blob'>): BlobRequestController<T>;
  public head<T>(url: Url, config?: Config<'arrayBuffer'>): ArrayBufferRequestController<T>;
  public head<T>(url: Url, config?: Config<'formData'>): FormDataRequestController<T>;
  public head<T>(url: Url, config?: Config<'string'>): StringRequestController<T>;
  public head<T>(url: Url, config?: Config<any>): AnyRequestController {
    return this.request<T>('HEAD', url, null, config);
  }

  public delete<T>(url: Url, config?: Config<'object'>): ObjectRequestController<T>;
  public delete<T>(url: Url, config?: Config<'response'>): ResponseRequestController<T>;
  public delete<T>(url: Url, config?: Config<'blob'>): BlobRequestController<T>;
  public delete<T>(url: Url, config?: Config<'arrayBuffer'>): ArrayBufferRequestController<T>;
  public delete<T>(url: Url, config?: Config<'formData'>): FormDataRequestController<T>;
  public delete<T>(url: Url, config?: Config<'string'>): StringRequestController<T>;
  public delete<T>(url: Url, config?: Config<any>): AnyRequestController {
    return this.request<T>('DELETE', url, null, config);
  }

  public options<T>(url: Url, config?: Config<'object'>): ObjectRequestController<T>;
  public options<T>(url: Url, config?: Config<'response'>): ResponseRequestController<T>;
  public options<T>(url: Url, config?: Config<'blob'>): BlobRequestController<T>;
  public options<T>(url: Url, config?: Config<'arrayBuffer'>): ArrayBufferRequestController<T>;
  public options<T>(url: Url, config?: Config<'formData'>): FormDataRequestController<T>;
  public options<T>(url: Url, config?: Config<'string'>): StringRequestController<T>;
  public options<T>(url: Url, config?: Config<any>): AnyRequestController {
    return this.request<T>('OPTIONS', url, null, config);
  }

  public post<T>(url: Url, body: any, config?: Config<'object'>): ObjectRequestController<T>;
  public post<T>(url: Url, body: any, config?: Config<'response'>): ResponseRequestController<T>;
  public post<T>(url: Url, body: any, config?: Config<'blob'>): BlobRequestController<T>;
  public post<T>(url: Url, body: any, config?: Config<'arrayBuffer'>): ArrayBufferRequestController<T>;
  public post<T>(url: Url, body: any, config?: Config<'formData'>): FormDataRequestController<T>;
  public post<T>(url: Url, body: any, config?: Config<'string'>): StringRequestController<T>;
  public post<T>(url: Url, body: any, config?: Config<any>): AnyRequestController {
    return this.request<T>('POST', url, body, config);
  }

  public put<T>(url: Url, body: any, config?: Config<'object'>): ObjectRequestController<T>;
  public put<T>(url: Url, body: any, config?: Config<'response'>): ResponseRequestController<T>;
  public put<T>(url: Url, body: any, config?: Config<'blob'>): BlobRequestController<T>;
  public put<T>(url: Url, body: any, config?: Config<'arrayBuffer'>): ArrayBufferRequestController<T>;
  public put<T>(url: Url, body: any, config?: Config<'formData'>): FormDataRequestController<T>;
  public put<T>(url: Url, body: any, config?: Config<'string'>): StringRequestController<T>;
  public put<T>(url: Url, body: any, config?: Config<any>): AnyRequestController {
    return this.request<T>('PUT', url, body, config);
  }

  public patch<T>(url: Url, body: any, config?: Config<'object'>): ObjectRequestController<T>;
  public patch<T>(url: Url, body: any, config?: Config<'response'>): ResponseRequestController<T>;
  public patch<T>(url: Url, body: any, config?: Config<'blob'>): BlobRequestController<T>;
  public patch<T>(url: Url, body: any, config?: Config<'arrayBuffer'>): ArrayBufferRequestController<T>;
  public patch<T>(url: Url, body: any, config?: Config<'formData'>): FormDataRequestController<T>;
  public patch<T>(url: Url, body: any, config?: Config<'string'>): StringRequestController<T>;
  public patch<T>(url: Url, body: any, config?: Config<any>): AnyRequestController {
    return this.request<T>('PATCH', url, body, config);
  }
}

export default new Drino();
