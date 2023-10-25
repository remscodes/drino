import type { HttpRequest } from '../../../request';
import type { HttpErrorResponse } from '../../../response';

export interface Interceptors<T = unknown> {
  beforeConsume: (request: HttpRequest) => void;
  afterConsume: (request: HttpRequest, response: Response) => void;
  // beforeRedirect: () => void;
  beforeResult: (result: T) => void;
  beforeError: (errorResponse: HttpErrorResponse) => void;
  beforeFinish: () => void;
}
