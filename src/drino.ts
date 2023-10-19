import type { DrinoInstance, HttpResponse } from './';
import { mergeInstanceConfig } from './drino-util';
import type { DrinoPlugin } from './models';
import type { DrinoDefaultConfig, DrinoDefaultConfigInit } from './models/drino.model';
import type { RequestMethodType, Url } from './models/http.model';
import type { RequestConfig } from './request';
import { RequestController } from './request';
import type { ArrayBufferBody, BlobBody, FormDataBody, ObjectBody, StringBody, VoidBody } from './request/models/request-controller.model';

const pluginIdsUsed: Set<string> = new Set();

export class Drino {

  public constructor(config: DrinoDefaultConfigInit, parentConfig?: DrinoDefaultConfig) {
    this.default = mergeInstanceConfig(config, parentConfig);
  }

  public default: DrinoDefaultConfig;

  public use(plugin: DrinoPlugin): void {
    if (pluginIdsUsed.has(plugin.id)) return;

    plugin.run({
      reqCtrlPrototype: RequestController.prototype
    });
    pluginIdsUsed.add(plugin.id);
  }

  public create(config: DrinoDefaultConfigInit): DrinoInstance {
    return new Drino(config);
  }

  public child(config: DrinoDefaultConfigInit): DrinoInstance {
    return new Drino(config, this.default);
  }

  private request<T>(method: RequestMethodType, url: Url, body?: any, config?: RequestConfig<any, any>): RequestController<any> {
    return new RequestController<T>({ method, url, body, config }, this.default);
  }

  /**
   * Builds a `GET` request controller that interprets the response body as an `object` and returns it.
   */
  public get<T>(url: Url, config?: RequestConfig): RequestController<ObjectBody<T>>;
  /**
   * Builds a `GET` request controller that interprets the response body as an `string` and returns it.
   */
  public get<T>(url: Url, config?: RequestConfig<'string'>): RequestController<StringBody<T>>;
  /**
   * Builds a `GET` request controller that interprets the response body as `void` and returns it.
   */
  public get<T>(url: Url, config?: RequestConfig<'none'>): RequestController<VoidBody<T>>;
  /**
   * Builds a `GET` request controller that interprets the response body as an `Blob` and returns it.
   */
  public get<T>(url: Url, config?: RequestConfig<'blob'>): RequestController<BlobBody<T>>;
  /**
   * Builds a `GET` request controller that interprets the response body as an `ArrayBuffer` and returns it.
   */
  public get<T>(url: Url, config?: RequestConfig<'arrayBuffer'>): RequestController<ArrayBufferBody<T>>;
  /**
   * Builds a `GET` request controller that interprets the response body as an `FormData` and returns it.
   */
  public get<T>(url: Url, config?: RequestConfig<'formData'>): RequestController<FormDataBody<T>>;
  /**
   * Builds a `GET` request controller that interprets the response body according to the response "content-type" header and returns it.
   */
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
    return this.request<T>('HEAD', url, null, config);
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

  // private options<T>(url: Url, config?: RequestConfig): RequestController<Headers>;
  // private options<T>(url: Url, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  // private options<T>(url: Url, config?: RequestConfig<any, any>): RequestController<any> {
  //   return this.request<T>('OPTIONS', url, null, config);
  // }

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

export default new Drino({});
