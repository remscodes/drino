import type { CommonResponseInit } from './common-response';
import { CommonResponse } from './common-response';

interface HttpResponseInit<T = any> extends CommonResponseInit {
  body: T;
}

export class HttpResponse<Resource> extends CommonResponse {

  public constructor(init: HttpResponseInit) {
    super(init);

    this.body = init.body;
  }

  public readonly body: Resource;
}
