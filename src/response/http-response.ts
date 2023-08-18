import type { CommonResponseInit } from './common-response';
import { CommonResponse } from './common-response';

interface HttpResponseInit<T = any> extends CommonResponseInit {
  ok: boolean;
  body: T;
}

export class HttpResponse<Resource> extends CommonResponse {

  public constructor(init: HttpResponseInit) {
    super(init);

    this.ok = init.ok;
    this.body = init.body;
  }

  public readonly ok: boolean;
  public readonly body: Resource;
}
