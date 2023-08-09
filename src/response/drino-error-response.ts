import type { CommonResponseInit } from './common-response';
import { CommonResponse } from './common-response';

interface DrinoErrorResponseInit extends CommonResponseInit {
  error: Error;
}

export class DrinoErrorResponse extends CommonResponse {

  public constructor(init: DrinoErrorResponseInit) {
    super(init);

    this.error = init.error;
  }

  public readonly error: Error;
}
