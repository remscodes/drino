import type { HttpRequest } from '../../../request';
import type { HttpErrorResponse } from '../../../response';

export interface Interceptors<T = unknown> {
  beforeConsume: BeforeConsumeFn;
  afterConsume: AfterConsumeFn;
  // beforeRedirect?: BeforeRedirectFn;
  beforeResult: BeforeResultFn<T>;
  beforeError: BeforeErrorFn;
  beforeFinish: BeforeFinishFn;
}

type BeforeConsumeFn = (request: HttpRequest) => void
type AfterConsumeFn = (request: HttpRequest, response: Response) => void
type BeforeRedirectFn = () => void
type BeforeResultFn<T> = (result: T) => void
type BeforeErrorFn = (errorResponse: HttpErrorResponse) => void
type BeforeFinishFn = () => void
