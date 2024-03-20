import type { HttpRequest } from '../../../request';
import type { HttpErrorResponse } from '../../../response';

export interface Interceptors<T = unknown> {
  beforeConsume: (req: HttpRequest) => void;
  afterConsume: (req: HttpRequest, res: Response) => void;
  // beforeRedirect: () => void;
  beforeResult: (res: T) => void;
  beforeError: (errRes: HttpErrorResponse) => void;
  beforeFinish: () => void;
}
