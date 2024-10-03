import type { HttpRequest, RequestController } from '../../../request';
import type { HttpErrorResponse, HttpResponse } from '../../../response';

export interface Interceptors {
  beforeConsume: (req: HttpRequest) => void;
  afterConsume: (req: HttpRequest, res: HttpResponse<any> | HttpErrorResponse, isError?: boolean) => (void | RequestController<any>);
  // beforeRedirect: () => void;
  beforeResult: (res: any) => void;
  beforeError: (errRes: HttpErrorResponse) => void;
  beforeFinish: () => void;
}
