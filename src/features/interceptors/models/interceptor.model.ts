import type { HttpRequest } from '../../../request';
import type { HttpErrorResponse, HttpResponse } from '../../../response';
import type { HttpContext } from '../context/http-context';

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
  ctx: HttpContext;
}

export interface BeforeConsumeArgs extends ReqAndContext {
  abort: (reason?: string) => void;
}

export type AfterConsumeArgs<T = any> = ReqAndContext &
  (
    | { res: HttpResponse<T>; ok: true; }
    | { res: HttpErrorResponse; ok: false; }
    )

export interface BeforeResultArgs extends ReqAndContext {
  res: any;
}

export interface BeforeErrorArgs extends ReqAndContext {
  /**
   * @see HttpErrorResponse
   */
  errRes: HttpErrorResponse;
  err: any;
}

export interface BeforeFinishArgs extends ReqAndContext {}
