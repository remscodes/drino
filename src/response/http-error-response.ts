import type { HttpCommonResponseInit } from './http-common-response';
import { HttpCommonResponse } from './http-common-response';

interface HttpErrorResponseInit extends HttpCommonResponseInit {
  error: any;
}

export class HttpErrorResponse extends HttpCommonResponse {

  public constructor(init: HttpErrorResponseInit) {
    super(init);

    this.error = init.error;
  }

  public readonly error: any;
}
