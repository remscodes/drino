import type { HttpCommonResponseInit } from './http-common-response';
import { HttpCommonResponse } from './http-common-response';

interface HttpResponseInit<T = any> extends HttpCommonResponseInit {
  body: T;
}

export class HttpResponse<Resource> extends HttpCommonResponse {

  public constructor(init: HttpResponseInit) {
    super(init);

    this.body = init.body;
  }

  public readonly body: Resource;
}
