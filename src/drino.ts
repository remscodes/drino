import type { DrinoInstance, HttpResponse } from './';
import type { DrinoDefaultConfig } from './models/drino.model';
import type { RequestMethodType, Url } from './models/http.model';
import type { RequestConfig } from './request';
import { RequestController } from './request';
import type { ArrayBufferBody, BlobBody, FormDataBody, ObjectBody, StringBody, VoidBody } from './request/models/request-controller.model';

export class Drino {

  public constructor(config: DrinoDefaultConfig = {}, parent?: Drino) {
    this._default = {
      ...parent?.default ?? {},
      ...config
    };

    this._default.requestsConfig = {
      headers: new Headers(),
      queryParams: new URLSearchParams(),
      ...parent?.default.requestsConfig ?? {},
      ...config.requestsConfig ?? {}
    };
  }

  private _default: DrinoDefaultConfig;

  public get default(): DrinoDefaultConfig {
    return this._default;
  }

  public set default(config: DrinoDefaultConfig) {
    this._default = {
      ...this.default,
      ...config
    };
  }

  public create(config: DrinoDefaultConfig = {}): DrinoInstance {
    return new Drino(config);
  }

  public child(config: DrinoDefaultConfig = {}): DrinoInstance {
    return new Drino(config, this);
  }

  private request<T>(method: RequestMethodType, url: Url, body?: any, config?: RequestConfig<any, any>): RequestController<any> {
    return new RequestController<T>({ method, url, body, config }, this.default);
  }

  public get<T>(url: Url, config?: RequestConfig): RequestController<ObjectBody<T>>;
  public get<T>(url: Url, config?: RequestConfig<'string'>): RequestController<StringBody<T>>;
  public get<T>(url: Url, config?: RequestConfig<'none'>): RequestController<VoidBody<T>>;
  public get<T>(url: Url, config?: RequestConfig<'blob'>): RequestController<BlobBody<T>>;
  public get<T>(url: Url, config?: RequestConfig<'arrayBuffer'>): RequestController<ArrayBufferBody<T>>;
  public get<T>(url: Url, config?: RequestConfig<'formData'>): RequestController<FormDataBody<T>>;
  public get<T>(url: Url, config?: RequestConfig<'auto'>): RequestController<T>;
  public get<T>(url: Url, config?: RequestConfig<'object', 'response'>): RequestController<HttpResponse<ObjectBody<T>>>;
  public get<T>(url: Url, config?: RequestConfig<'string', 'response'>): RequestController<HttpResponse<StringBody<T>>>;
  public get<T>(url: Url, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  public get<T>(url: Url, config?: RequestConfig<'blob', 'response'>): RequestController<HttpResponse<BlobBody<T>>>;
  public get<T>(url: Url, config?: RequestConfig<'arrayBuffer', 'response'>): RequestController<HttpResponse<ArrayBufferBody<T>>>;
  public get<T>(url: Url, config?: RequestConfig<'formData', 'response'>): RequestController<HttpResponse<FormDataBody<T>>>;
  public get<T>(url: Url, config?: RequestConfig<'auto', 'response'>): RequestController<HttpResponse<T>>;
  public get<T>(url: Url, config?: RequestConfig<any, any>): RequestController<any> {
    return this.request<T>('GET', url, null, config);
  }

  public head<T>(url: Url, config?: RequestConfig): RequestController<Headers>;
  public head<T>(url: Url, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  public head<T>(url: Url, config?: RequestConfig<any, any>): RequestController<any> {
    return this.request<T>('HEAD', url, null, { ...config, read: 'none' });
  }

  public delete<T>(url: Url, config?: RequestConfig): RequestController<ObjectBody<T>>;
  public delete<T>(url: Url, config?: RequestConfig<'string'>): RequestController<StringBody<T>>;
  public delete<T>(url: Url, config?: RequestConfig<'none'>): RequestController<VoidBody<T>>;
  public delete<T>(url: Url, config?: RequestConfig<'blob'>): RequestController<BlobBody<T>>;
  public delete<T>(url: Url, config?: RequestConfig<'arrayBuffer'>): RequestController<ArrayBufferBody<T>>;
  public delete<T>(url: Url, config?: RequestConfig<'formData'>): RequestController<FormDataBody<T>>;
  public delete<T>(url: Url, config?: RequestConfig<'auto'>): RequestController<T>;
  public delete<T>(url: Url, config?: RequestConfig<'object', 'response'>): RequestController<HttpResponse<ObjectBody<T>>>;
  public delete<T>(url: Url, config?: RequestConfig<'string', 'response'>): RequestController<HttpResponse<StringBody<T>>>;
  public delete<T>(url: Url, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  public delete<T>(url: Url, config?: RequestConfig<'blob', 'response'>): RequestController<HttpResponse<BlobBody<T>>>;
  public delete<T>(url: Url, config?: RequestConfig<'arrayBuffer', 'response'>): RequestController<HttpResponse<ArrayBufferBody<T>>>;
  public delete<T>(url: Url, config?: RequestConfig<'formData', 'response'>): RequestController<HttpResponse<FormDataBody<T>>>;
  public delete<T>(url: Url, config?: RequestConfig<'auto', 'response'>): RequestController<HttpResponse<T>>;
  public delete<T>(url: Url, config?: RequestConfig<any, any>): RequestController<any> {
    return this.request<T>('DELETE', url, null, config);
  }

  private options<T>(url: Url, config?: RequestConfig): RequestController<Headers>;
  private options<T>(url: Url, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  private options<T>(url: Url, config?: RequestConfig<any, any>): RequestController<any> {
    return this.request<T>('OPTIONS', url, null, config);
  }

  public post<T>(url: Url, body: any, config?: RequestConfig): RequestController<ObjectBody<T>>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'string'>): RequestController<StringBody<T>>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'none'>): RequestController<VoidBody<T>>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'blob'>): RequestController<BlobBody<T>>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer'>): RequestController<ArrayBufferBody<T>>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'formData'>): RequestController<FormDataBody<T>>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'auto'>): RequestController<T>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'object', 'response'>): RequestController<HttpResponse<ObjectBody<T>>>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'string', 'response'>): RequestController<HttpResponse<StringBody<T>>>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'blob', 'response'>): RequestController<HttpResponse<BlobBody<T>>>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer', 'response'>): RequestController<HttpResponse<ArrayBufferBody<T>>>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'formData', 'response'>): RequestController<HttpResponse<FormDataBody<T>>>;
  public post<T>(url: Url, body: any, config?: RequestConfig<'auto', 'response'>): RequestController<HttpResponse<T>>;
  public post<T>(url: Url, body: any, config?: RequestConfig<any, any>): RequestController<any> {
    return this.request<T>('POST', url, body, config);
  }

  public put<T>(url: Url, body: any, config?: RequestConfig): RequestController<ObjectBody<T>>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'string'>): RequestController<StringBody<T>>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'none'>): RequestController<VoidBody<T>>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'blob'>): RequestController<BlobBody<T>>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer'>): RequestController<ArrayBufferBody<T>>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'formData'>): RequestController<FormDataBody<T>>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'auto'>): RequestController<T>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'object', 'response'>): RequestController<HttpResponse<ObjectBody<T>>>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'string', 'response'>): RequestController<HttpResponse<StringBody<T>>>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'blob', 'response'>): RequestController<HttpResponse<BlobBody<T>>>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer', 'response'>): RequestController<HttpResponse<ArrayBufferBody<T>>>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'formData', 'response'>): RequestController<HttpResponse<FormDataBody<T>>>;
  public put<T>(url: Url, body: any, config?: RequestConfig<'auto', 'response'>): RequestController<HttpResponse<T>>;
  public put<T>(url: Url, body: any, config?: RequestConfig<any, any>): RequestController<any> {
    return this.request<T>('PUT', url, body, config);
  }

  public patch<T>(url: Url, body: any, config?: RequestConfig): RequestController<ObjectBody<T>>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'string'>): RequestController<StringBody<T>>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'none'>): RequestController<VoidBody<T>>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'blob'>): RequestController<BlobBody<T>>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer'>): RequestController<ArrayBufferBody<T>>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'formData'>): RequestController<FormDataBody<T>>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'auto'>): RequestController<T>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'object', 'response'>): RequestController<HttpResponse<ObjectBody<T>>>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'string', 'response'>): RequestController<HttpResponse<StringBody<T>>>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'blob', 'response'>): RequestController<HttpResponse<BlobBody<T>>>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer', 'response'>): RequestController<HttpResponse<ArrayBufferBody<T>>>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'formData', 'response'>): RequestController<HttpResponse<FormDataBody<T>>>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<'auto', 'response'>): RequestController<HttpResponse<T>>;
  public patch<T>(url: Url, body: any, config?: RequestConfig<any, any>): RequestController<any> {
    return this.request<T>('PATCH', url, body, config);
  }
}

export default new Drino();
