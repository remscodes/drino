import type { CommonResponseInit } from './common-response';
import { CommonResponse } from './common-response';

interface DrinoResponseInit<Data = any> extends CommonResponseInit {
  ok: boolean;
  body: Data;
}

export class DrinoResponse<Resource> extends CommonResponse {

  public constructor(init: DrinoResponseInit) {
    super(init);

    this.ok = init.ok;
    this.body = init.body;
  }

  public readonly ok: boolean;
  public readonly body: Resource;
}
