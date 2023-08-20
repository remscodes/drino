import type { HttpRequest } from '../../../request/http-request';
import type { HttpErrorResponse } from '../../../response';

export interface Interceptors<T = any> {
  beforeConsume?: BeforeConsumeFn;
  afterConsume?: AfterConsumeFn;
  beforeResult?: BeforeResultFn<T>;
  beforeError?: BeforeErrorFn;
  beforeFinish?: BeforeFinishFn;
}

type BeforeConsumeFn = (request: HttpRequest) => void
type AfterConsumeFn = (request: HttpRequest) => void
type BeforeResultFn<T> = (result: T) => void
type BeforeErrorFn = (errorResponse: HttpErrorResponse) => void
type BeforeFinishFn = () => void
