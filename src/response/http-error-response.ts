import type { CommonResponseInit } from './common-response';
import { CommonResponse } from './common-response';

interface HttpErrorResponseInit extends CommonResponseInit {
  error: Error;
}

export class HttpErrorResponse extends CommonResponse {

  public constructor(init: HttpErrorResponseInit) {
    super(init);

    this.error = init.error;
  }

  public readonly error: Error;
}
