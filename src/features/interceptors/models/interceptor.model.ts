import { HttpRequest } from '../../../request';
import type { HttpErrorResponse, HttpResponse } from '../../../response';
import { HttpContext } from '../context/http-context';

export interface Interceptors {
  beforeConsume: (args: BeforeConsumeArgs) => void;
  afterConsume: (args: AfterConsumeArgs) => void;
  // beforeRedirect: () => void;
  beforeResult: (args: BeforeResultArgs) => void;
  beforeError: (args: BeforeErrorArgs) => void;
  beforeFinish: (args: BeforeFinishArgs) => void;
}

interface ReqAndContext {
  /**
   * @see HttpRequest
   */
  req: HttpRequest;
  /**
   * @see HttpContext
   */
  context: HttpContext;
}

interface BeforeConsumeArgs extends ReqAndContext {}

type AfterConsumeArgs<T = any> = ReqAndContext &
  (
    | { res: HttpResponse<T>; ok: true; }
    | { res: HttpErrorResponse; ok: false; }
    )

interface BeforeResultArgs extends ReqAndContext {
  res: any;
}

interface BeforeErrorArgs extends ReqAndContext {
  /**
   * @see HttpErrorResponse
   */
  errRes: HttpErrorResponse;
  err: any;
}

interface BeforeFinishArgs extends ReqAndContext {}
