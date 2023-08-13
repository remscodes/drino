import type { AnyRequestController, ArrayBufferRequestController, BlobRequestController, DrinoInstance, FormDataRequestController, ObjectRequestController, ResponseRequestController, StringRequestController } from './';
import type { DrinoConfig } from './models/drino.model';
import type { RequestMethodType, Url } from './models/http.model';
import { RequestController } from './request';
import type { RequestConfig } from './request/models/request-config.model';

export class Drino {

  public constructor(config: DrinoConfig = {}, parent?: Drino) {
    this._defaultConfig = {
      ...parent?.defaultConfig ?? {},
      ...config
    };
    
    this._defaultConfig.requestConfig = {
      headers: new Headers(),
      queryParams: new URLSearchParams(),
      ...parent?.defaultConfig.requestConfig ?? {},
      ...config.requestConfig ?? {}
    };
  }

  private _defaultConfig: DrinoConfig;

  public get defaultConfig(): DrinoConfig {
    return this._defaultConfig;
  }

  public set defaultConfig(config: DrinoConfig) {
    this._defaultConfig = {
      ...this.defaultConfig,
      ...config
    };
  }

  public create(config: DrinoConfig = {}): DrinoInstance {
    return new Drino(config);
  }

  public child(config: DrinoConfig = {}): DrinoInstance {
    return new Drino(config, this);
  }

  private request<T>(method: RequestMethodType, url: Url, body?: any, config?: RequestConfig<'object'>): ObjectRequestController<T>;
  private request<T>(method: RequestMethodType, url: Url, body?: any, config?: RequestConfig<'response'>): ResponseRequestController<T>;
  private request<T>(method: RequestMethodType, url: Url, body?: any, config?: RequestConfig<'blob'>): BlobRequestController<T>;
  private request<T>(method: RequestMethodType, url: Url, body?: any, config?: RequestConfig<'arrayBuffer'>): ArrayBufferRequestController<T>;
  private request<T>(method: RequestMethodType, url: Url, body?: any, config?: RequestConfig<'formData'>): FormDataRequestController<T>;
  private request<T>(method: RequestMethodType, url: Url, body?: any, config?: RequestConfig<'string'>): StringRequestController<T>;
  private request<T>(method: RequestMethodType, url: Url, body?: any, config?: RequestConfig<any>): AnyRequestController {
    return new RequestController<T>({ method, url, body, config }, this.defaultConfig);
  }

  public get<T>(url: Url, config?: RequestConfig<'object'>): ObjectRequestController<T>;
  public get<T>(url: Url, config?: RequestConfig<'response'>): ResponseRequestController<T>;
  public get<T>(url: Url, config?: RequestConfig<'blob'>): BlobRequestController<T>;
  public get<T>(url: Url, config?: RequestConfig<'arrayBuffer'>): ArrayBufferRequestController<T>;
  public get<T>(url: Url, config?: RequestConfig<'formData'>): FormDataRequestController<T>;
  public get<T>(url: Url, config?: RequestConfig<'string'>): StringRequestController<T>;
  public get<T>(url: Url, config?: RequestConfig<any>): AnyRequestController {
    return this.request<T>('GET', url, null, config);
  }

  public head<T>(url: Url, config?: RequestConfig<'object'>): ObjectRequestController<T>;
  public head<T>(url: Url, config?: RequestConfig<'response'>): ResponseRequestController<T>;
  public head<T>(url: Url, config?: RequestConfig<'blob'>): BlobRequestController<T>;
  public head<T>(url: Url, config?: RequestConfig<'arrayBuffer'>): ArrayBufferRequestController<T>;
  public head<T>(url: Url, config?: RequestConfig<'formData'>): FormDataRequestController<T>;
  public head<T>(url: Url, config?: RequestConfig<'string'>): StringRequestController<T>;
  public head<T>(url: Url, config?: RequestConfig<any>): AnyRequestController {
    return this.request<T>('HEAD', url, null, config);
  }

  public delete<T>(url: Url, config?: RequestConfig<'object'>): ObjectRequestController<T>;
  public delete<T>(url: Url, config?: RequestConfig<'response'>): ResponseRequestController<T>;
  public delete<T>(url: Url, config?: RequestConfig<'blob'>): BlobRequestController<T>;
  public delete<T>(url: Url, config?: RequestConfig<'arrayBuffer'>): ArrayBufferRequestController<T>;
  public delete<T>(url: Url, config?: RequestConfig<'formData'>): FormDataRequestController<T>;
  public delete<T>(url: Url, config?: RequestConfig<'string'>): StringRequestController<T>;
  public delete<T>(url: Url, config?: RequestConfig<any>): AnyRequestController {
    return this.request<T>('DELETE', url, null, config);
  }

  public options<T>(url: Url, config?: RequestConfig<'object'>): ObjectRequestController<T>;
  public options<T>(url: Url, config?: RequestConfig<'response'>): ResponseRequestController<T>;
  public options<T>(url: Url, config?: RequestConfig<'blob'>): BlobRequestController<T>;
  public options<T>(url: Url, config?: RequestConfig<'arrayBuffer'>): ArrayBufferRequestController<T>;
  public options<T>(url: Url, config?: RequestConfig<'formData'>): FormDataRequestController<T>;
  public options<T>(url: Url, config?: RequestConfig<'string'>): StringRequestController<T>;
  public options<T>(url: Url, config?: RequestConfig<any>): AnyRequestController {
    return this.request<T>('OPTIONS', url, null, config);
  }

  public post<T>(url: Url, body: any, config?: RequestConfig<'object'>): ObjectRequestController<T>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'response'>): ResponseRequestController<T>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'blob'>): BlobRequestController<T>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer'>): ArrayBufferRequestController<T>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'formData'>): FormDataRequestController<T>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'string'>): StringRequestController<T>;
  public post<T>(url: Url, body: any, config?: RequestConfig<any>): AnyRequestController {
    return this.request<T>('POST', url, body, config);
  }

  public put<T>(url: Url, body: any, config?: RequestConfig<'object'>): ObjectRequestController<T>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'response'>): ResponseRequestController<T>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'blob'>): BlobRequestController<T>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer'>): ArrayBufferRequestController<T>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'formData'>): FormDataRequestController<T>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'string'>): StringRequestController<T>;
  public put<T>(url: Url, body: any, config?: RequestConfig<any>): AnyRequestController {
    return this.request<T>('PUT', url, body, config);
  }

  public patch<T>(url: Url, body: any, config?: RequestConfig<'object'>): ObjectRequestController<T>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'response'>): ResponseRequestController<T>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'blob'>): BlobRequestController<T>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer'>): ArrayBufferRequestController<T>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'formData'>): FormDataRequestController<T>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'string'>): StringRequestController<T>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<any>): AnyRequestController {
    return this.request<T>('PATCH', url, body, config);
  }
}

export default new Drino();
