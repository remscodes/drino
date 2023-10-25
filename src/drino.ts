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

  /** @internal */
  public constructor(config: DrinoDefaultConfigInit, parentConfig?: DrinoDefaultConfig) {
    this.default = mergeInstanceConfig(config, parentConfig);
  }

  public default: DrinoDefaultConfig;

  /**
   * Use third-party plugin to add more features.
   */
  public use(plugin: DrinoPlugin): void {
    if (pluginIdsUsed.has(plugin.id)) return;

    plugin.run({ reqCtrlPrototype: RequestController.prototype });
    pluginIdsUsed.add(plugin.id);
  }

  /**
   * Creates a new Drino instance with a configuration that will be propagated to all requests produced from this instance.
   */
  public create(config: DrinoDefaultConfigInit): DrinoInstance {
    return new Drino(config);
  }

  /**
   * Creates a new Drino instance from another to inherit its configuration.
   */
  public child(config: DrinoDefaultConfigInit): DrinoInstance {
    return new Drino(config, this.default);
  }

  /**
   * Builds a new request controller.
   * @internal
   */
  private request<T>(method: RequestMethodType, url: Url, body?: any, config?: RequestConfig<any, any>): RequestController<any> {
    return new RequestController<T>({ method, url, body, config }, this.default);
  }

  /**
   * Builds a `GET` request controller that interprets the response body as an `object` and returns it.
   */
  public get<T>(url: Url, config?: RequestConfig): RequestController<ObjectBody<T>>;
  /**
   * Builds a `GET` request controller that interprets the response body as a `string` and returns it.
   */
  public get<T>(url: Url, config?: RequestConfig<'string'>): RequestController<StringBody<T>>;
  /**
   * Builds a `GET` request controller that interprets the response body as `void` and returns it.
   */
  public get<T>(url: Url, config?: RequestConfig<'none'>): RequestController<VoidBody<T>>;
  /**
   * Builds a `GET` request controller that interprets the response body as a `Blob` and returns it.
   */
  public get<T>(url: Url, config?: RequestConfig<'blob'>): RequestController<BlobBody<T>>;
  /**
   * Builds a `GET` request controller that interprets the response body as an `ArrayBuffer` and returns it.
   */
  public get<T>(url: Url, config?: RequestConfig<'arrayBuffer'>): RequestController<ArrayBufferBody<T>>;
  /**
   * Builds a `GET` request controller that interprets the response body as a `FormData` and returns it.
   */
  public get<T>(url: Url, config?: RequestConfig<'formData'>): RequestController<FormDataBody<T>>;
  /**
   * Builds a `GET` request controller that interprets the response body according to the response "content-type" header and returns it.
   */
  public get<T>(url: Url, config?: RequestConfig<'auto'>): RequestController<T>;
  /**
   * Builds a `GET` request controller that interprets the response body as an `object` and returns it wrapped into a `HttpResponse`.
   */
  public get<T>(url: Url, config?: RequestConfig<'object', 'response'>): RequestController<HttpResponse<ObjectBody<T>>>;
  /**
   * Builds a `GET` request controller that interprets the response body as a `string` and returns it wrapped into a `HttpResponse`.
   */
  public get<T>(url: Url, config?: RequestConfig<'string', 'response'>): RequestController<HttpResponse<StringBody<T>>>;
  /**
   * Builds a `GET` request controller that interprets the response body as `void` and returns it wrapped into a `HttpResponse`.
   */
  public get<T>(url: Url, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  /**
   * Builds a `GET` request controller that interprets the response body as a `Blob` and returns it wrapped into a `HttpResponse`.
   */
  public get<T>(url: Url, config?: RequestConfig<'blob', 'response'>): RequestController<HttpResponse<BlobBody<T>>>;
  /**
   * Builds a `GET` request controller that interprets the response body as an `ArrayBuffer` and returns it wrapped into a `HttpResponse`.
   */
  public get<T>(url: Url, config?: RequestConfig<'arrayBuffer', 'response'>): RequestController<HttpResponse<ArrayBufferBody<T>>>;
  /**
   * Builds a `GET` request controller that interprets the response body as a `FormData` and returns it wrapped into a `HttpResponse`.
   */
  public get<T>(url: Url, config?: RequestConfig<'formData', 'response'>): RequestController<HttpResponse<FormDataBody<T>>>;
  /**
   * Builds a `GET` request controller that interprets the response body according to the response "content-type" header and returns it wrapped into a `HttpResponse`.
   */
  public get<T>(url: Url, config?: RequestConfig<'auto', 'response'>): RequestController<HttpResponse<T>>;
  /**
   * Builds a `GET` request controller.
   * @internal
   */
  public get<T>(url: Url, config?: RequestConfig<any, any>): RequestController<any> {
    return this.request<T>('GET', url, null, config);
  }

  /**
   * Builds a `HEAD` request controller that returns response `Headers`.
   */
  public head<T>(url: Url, config?: RequestConfig): RequestController<Headers>;
  /**
   * Builds a `HEAD` request controller that interprets the response body as `void` and returns it wrapped into a `HttpResponse`.
   */
  public head<T>(url: Url, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  /**
   * Builds a `HEAD` request controller.
   * @internal
   */
  public head<T>(url: Url, config?: RequestConfig<any, any>): RequestController<any> {
    return this.request<T>('HEAD', url, null, config);
  }

  /**
   * Builds a `DELETE` request controller that interprets the response body as an `object` and returns it.
   */
  public delete<T>(url: Url, config?: RequestConfig): RequestController<ObjectBody<T>>;
  /**
   * Builds a `DELETE` request controller that interprets the response body as a `string` and returns it.
   */
  public delete<T>(url: Url, config?: RequestConfig<'string'>): RequestController<StringBody<T>>;
  /**
   * Builds a `DELETE` request controller that interprets the response body as `void` and returns it.
   */
  public delete<T>(url: Url, config?: RequestConfig<'none'>): RequestController<VoidBody<T>>;
  /**
   * Builds a `DELETE` request controller that interprets the response body as a `Blob` and returns it.
   */
  public delete<T>(url: Url, config?: RequestConfig<'blob'>): RequestController<BlobBody<T>>;
  /**
   * Builds a `DELETE` request controller that interprets the response body as an `ArrayBuffer` and returns it.
   */
  public delete<T>(url: Url, config?: RequestConfig<'arrayBuffer'>): RequestController<ArrayBufferBody<T>>;
  /**
   * Builds a `DELETE` request controller that interprets the response body as a `FormData` and returns it.
   */
  public delete<T>(url: Url, config?: RequestConfig<'formData'>): RequestController<FormDataBody<T>>;
  /**
   * Builds a `DELETE` request controller that interprets the response body according to the response "content-type" header and returns it.
   */
  public delete<T>(url: Url, config?: RequestConfig<'auto'>): RequestController<T>;
  /**
   * Builds a `DELETE` request controller that interprets the response body as an `object` and returns it wrapped into a `HttpResponse`.
   */
  public delete<T>(url: Url, config?: RequestConfig<'object', 'response'>): RequestController<HttpResponse<ObjectBody<T>>>;
  /**
   * Builds a `DELETE` request controller that interprets the response body as a `string` and returns it wrapped into a `HttpResponse`.
   */
  public delete<T>(url: Url, config?: RequestConfig<'string', 'response'>): RequestController<HttpResponse<StringBody<T>>>;
  /**
   * Builds a `DELETE` request controller that interprets the response body as `void` and returns it wrapped into a `HttpResponse`.
   */
  public delete<T>(url: Url, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  /**
   * Builds a `DELETE` request controller that interprets the response body as an `Blob` and returns it wrapped into a `HttpResponse`.
   */
  public delete<T>(url: Url, config?: RequestConfig<'blob', 'response'>): RequestController<HttpResponse<BlobBody<T>>>;
  /**
   * Builds a `DELETE` request controller that interprets the response body as an `ArrayBuffer` and returns it wrapped into a `HttpResponse`.
   */
  public delete<T>(url: Url, config?: RequestConfig<'arrayBuffer', 'response'>): RequestController<HttpResponse<ArrayBufferBody<T>>>;
  /**
   * Builds a `DELETE` request controller that interprets the response body as a `FormData` and returns it wrapped into a `HttpResponse`.
   */
  public delete<T>(url: Url, config?: RequestConfig<'formData', 'response'>): RequestController<HttpResponse<FormDataBody<T>>>;
  /**
   * Builds a `DELETE` request controller that interprets the response body according to the response "content-type" header and returns it wrapped into a `HttpResponse`.
   */
  public delete<T>(url: Url, config?: RequestConfig<'auto', 'response'>): RequestController<HttpResponse<T>>;
  /**
   * Builds a `DELETE` request controller.
   * @internal
   */
  public delete<T>(url: Url, config?: RequestConfig<any, any>): RequestController<any> {
    return this.request<T>('DELETE', url, null, config);
  }

  // private options<T>(url: Url, config?: RequestConfig): RequestController<Headers>;
  // private options<T>(url: Url, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  // private options<T>(url: Url, config?: RequestConfig<any, any>): RequestController<any> {
  //   return this.request<T>('OPTIONS', url, null, config);
  // }

  /**
   * Builds a `POST` request controller that interprets the response body as an `object` and returns it.
   */
  public post<T>(url: Url, body: any, config?: RequestConfig): RequestController<ObjectBody<T>>;
  /**
   * Builds a `POST` request controller that interprets the response body as a `string` and returns it.
   */
  public post<T>(url: Url, body: any, config?: RequestConfig<'string'>): RequestController<StringBody<T>>;
  /**
   * Builds a `POST` request controller that interprets the response body as `void` and returns it.
   */
  public post<T>(url: Url, body: any, config?: RequestConfig<'none'>): RequestController<VoidBody<T>>;
  /**
   * Builds a `POST` request controller that interprets the response body as a `Blob` and returns it.
   */
  public post<T>(url: Url, body: any, config?: RequestConfig<'blob'>): RequestController<BlobBody<T>>;
  /**
   * Builds a `POST` request controller that interprets the response body as an `ArrayBuffer` and returns it.
   */
  public post<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer'>): RequestController<ArrayBufferBody<T>>;
  /**
   * Builds a `POST` request controller that interprets the response body as a `FormData` and returns it.
   */
  public post<T>(url: Url, body: any, config?: RequestConfig<'formData'>): RequestController<FormDataBody<T>>;
  /**
   * Builds a `POST` request controller that interprets the response body according to the response "content-type" header and returns it.
   */
  public post<T>(url: Url, body: any, config?: RequestConfig<'auto'>): RequestController<T>;
  /**
   * Builds a `POST` request controller that interprets the response body as an `object` and returns it wrapped into a `HttpResponse`.
   */
  public post<T>(url: Url, body: any, config?: RequestConfig<'object', 'response'>): RequestController<HttpResponse<ObjectBody<T>>>;
  /**
   * Builds a `POST` request controller that interprets the response body as a `string` and returns it wrapped into a `HttpResponse`.
   */
  public post<T>(url: Url, body: any, config?: RequestConfig<'string', 'response'>): RequestController<HttpResponse<StringBody<T>>>;
  /**
   * Builds a `POST` request controller that interprets the response body as `void` and returns it wrapped into a `HttpResponse`.
   */
  public post<T>(url: Url, body: any, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  /**
   * Builds a `POST` request controller that interprets the response body as a `Blob` and returns it wrapped into a `HttpResponse`.
   */
  public post<T>(url: Url, body: any, config?: RequestConfig<'blob', 'response'>): RequestController<HttpResponse<BlobBody<T>>>;
  /**
   * Builds a `POST` request controller that interprets the response body as an `ArrayBuffer` and returns it wrapped into a `HttpResponse`.
   */
  public post<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer', 'response'>): RequestController<HttpResponse<ArrayBufferBody<T>>>;
  /**
   * Builds a `POST` request controller that interprets the response body as a `FormData` and returns it wrapped into a `HttpResponse`.
   */
  public post<T>(url: Url, body: any, config?: RequestConfig<'formData', 'response'>): RequestController<HttpResponse<FormDataBody<T>>>;
  /**
   * Builds a `POST` request controller that interprets the response body according to the response "content-type" header and returns it wrapped into a `HttpResponse`.
   */
  public post<T>(url: Url, body: any, config?: RequestConfig<'auto', 'response'>): RequestController<HttpResponse<T>>;
  /**
   * Builds a `POST` request controller.
   * @internal
   */
  public post<T>(url: Url, body: any, config?: RequestConfig<any, any>): RequestController<any> {
    return this.request<T>('POST', url, body, config);
  }

  /**
   * Builds a `PUT` request controller that interprets the response body as an `object` and returns it.
   */
  public put<T>(url: Url, body: any, config?: RequestConfig): RequestController<ObjectBody<T>>;
  /**
   * Builds a `PUT` request controller that interprets the response body as a `string` and returns it.
   */
  public put<T>(url: Url, body: any, config?: RequestConfig<'string'>): RequestController<StringBody<T>>;
  /**
   * Builds a `PUT` request controller that interprets the response body as `void` and returns it.
   */
  public put<T>(url: Url, body: any, config?: RequestConfig<'none'>): RequestController<VoidBody<T>>;
  /**
   * Builds a `PUT` request controller that interprets the response body as a `Blob` and returns it.
   */
  public put<T>(url: Url, body: any, config?: RequestConfig<'blob'>): RequestController<BlobBody<T>>;
  /**
   * Builds a `PUT` request controller that interprets the response body as an `ArrayBuffer` and returns it.
   */
  public put<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer'>): RequestController<ArrayBufferBody<T>>;
  /**
   * Builds a `PUT` request controller that interprets the response body as a `FormData` and returns it.
   */
  public put<T>(url: Url, body: any, config?: RequestConfig<'formData'>): RequestController<FormDataBody<T>>;
  /**
   * Builds a `PUT` request controller that interprets the response body according to the response "content-type" header and returns it.
   */
  public put<T>(url: Url, body: any, config?: RequestConfig<'auto'>): RequestController<T>;
  /**
   * Builds a `PUT` request controller that interprets the response body as an `object` and returns it wrapped into a `HttpResponse`.
   */
  public put<T>(url: Url, body: any, config?: RequestConfig<'object', 'response'>): RequestController<HttpResponse<ObjectBody<T>>>;
  /**
   * Builds a `PUT` request controller that interprets the response body as a `string` and returns it wrapped into a `HttpResponse`.
   */
  public put<T>(url: Url, body: any, config?: RequestConfig<'string', 'response'>): RequestController<HttpResponse<StringBody<T>>>;
  /**
   * Builds a `PUT` request controller that interprets the response body as `void` and returns it wrapped into a `HttpResponse`.
   */
  public put<T>(url: Url, body: any, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  /**
   * Builds a `PUT` request controller that interprets the response body as a `Blob` and returns it wrapped into a `HttpResponse`.
   */
  public put<T>(url: Url, body: any, config?: RequestConfig<'blob', 'response'>): RequestController<HttpResponse<BlobBody<T>>>;
  /**
   * Builds a `PUT` request controller that interprets the response body as an `ArrayBuffer` and returns it wrapped into a `HttpResponse`.
   */
  public put<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer', 'response'>): RequestController<HttpResponse<ArrayBufferBody<T>>>;
  /**
   * Builds a `PUT` request controller that interprets the response body as a `FormData` and returns it wrapped into a `HttpResponse`.
   */
  public put<T>(url: Url, body: any, config?: RequestConfig<'formData', 'response'>): RequestController<HttpResponse<FormDataBody<T>>>;
  /**
   * Builds a `PUT` request controller that interprets the response body according to the response "content-type" header and returns it wrapped into a `HttpResponse`.
   */
  public put<T>(url: Url, body: any, config?: RequestConfig<'auto', 'response'>): RequestController<HttpResponse<T>>;
  /**
   * Builds a `PUT` request controller.
   * @internal
   */
  public put<T>(url: Url, body: any, config?: RequestConfig<any, any>): RequestController<any> {
    return this.request<T>('PUT', url, body, config);
  }

  /**
   * Builds a `PATCH` request controller that interprets the response body as an `object` and returns it.
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig): RequestController<ObjectBody<T>>;
  /**
   * Builds a `PATCH` request controller that interprets the response body as a `string` and returns it.
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig<'string'>): RequestController<StringBody<T>>;
  /**
   * Builds a `PATCH` request controller that interprets the response body as `void` and returns it.
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig<'none'>): RequestController<VoidBody<T>>;
  /**
   * Builds a `PATCH` request controller that interprets the response body as a `Blob` and returns it.
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig<'blob'>): RequestController<BlobBody<T>>;
  /**
   * Builds a `PATCH` request controller that interprets the response body as an `ArrayBuffer` and returns it.
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer'>): RequestController<ArrayBufferBody<T>>;
  /**
   * Builds a `PATCH` request controller that interprets the response body as a `FormData` and returns it.
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig<'formData'>): RequestController<FormDataBody<T>>;
  /**
   * Builds a `PATCH` request controller that interprets the response body according to the response "content-type" header and returns it.
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig<'auto'>): RequestController<T>;
  /**
   * Builds a `PATCH` request controller that interprets the response body as an `object` and returns it wrapped into a `HttpResponse`.
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig<'object', 'response'>): RequestController<HttpResponse<ObjectBody<T>>>;
  /**
   * Builds a `PATCH` request controller that interprets the response body as a `string` and returns it wrapped into a `HttpResponse`.
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig<'string', 'response'>): RequestController<HttpResponse<StringBody<T>>>;
  /**
   * Builds a `PATCH` request controller that interprets the response body as `void` and returns it wrapped into a `HttpResponse`.
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig<'none', 'response'>): RequestController<HttpResponse<VoidBody<T>>>;
  /**
   * Builds a `PATCH` request controller that interprets the response body as a `Blob` and returns it wrapped into a `HttpResponse`.
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig<'blob', 'response'>): RequestController<HttpResponse<BlobBody<T>>>;
  /**
   * Builds a `PATCH` request controller that interprets the response body as an `ArrayBuffer` and returns it wrapped into a `HttpResponse`.
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig<'arrayBuffer', 'response'>): RequestController<HttpResponse<ArrayBufferBody<T>>>;
  /**
   * Builds a `PATCH` request controller that interprets the response body as a `FormData` and returns it wrapped into a `HttpResponse`.
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig<'formData', 'response'>): RequestController<HttpResponse<FormDataBody<T>>>;
  /**
   * Builds a `PATCH` request controller that interprets the response body according to the response "content-type" header and returns it wrapped into a `HttpResponse`.
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig<'auto', 'response'>): RequestController<HttpResponse<T>>;
  /**
   * Builds a `PATCH` request controller.
   * @internal
   */
  public patch<T>(url: Url, body: any, config?: RequestConfig<any, any>): RequestController<any> {
    return this.request<T>('PATCH', url, body, config);
  }
}

export default new Drino({});
