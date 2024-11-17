import type { Promisable } from '../../../models/shared.model';
import type { HttpRequest } from '../../../request';
import type { HttpErrorResponse, HttpResponse } from '../../../response';
import type { HttpContext } from '../context/http-context';

export interface Interceptors {
  beforeConsume: (args: BeforeConsumeArgs) => Promisable<void>;
  afterConsume: (args: AfterConsumeArgs) => Promisable<void>;
  // beforeRedirect: () => Promisable<void>;
  beforeResult: (args: BeforeResultArgs) => Promisable<void>;
  beforeError: (args: BeforeErrorArgs) => Promisable<void>;
  beforeFinish: (args: BeforeFinishArgs) => Promisable<void>;
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

export interface BeforeResultArgs<T = any> extends ReqAndContext {
  res: HttpResponse<T>;
}

export interface BeforeErrorArgs extends ReqAndContext {
  /**
   * @see HttpErrorResponse
   */
  errRes: HttpErrorResponse;
  err: any;
}

export interface BeforeFinishArgs extends ReqAndContext {}
