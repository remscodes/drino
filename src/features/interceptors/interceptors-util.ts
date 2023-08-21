import type { HttpRequest } from '../../request/http-request';
import type { HttpErrorResponse } from '../../response';
import type { Interceptors } from './models/interceptor.model';

export function mergeInterceptors(defaultInterceptors: Interceptors, interceptors: Interceptors): Required<Interceptors> {
  return {
    beforeConsume: (request: HttpRequest) => {
      defaultInterceptors.beforeConsume?.(request);
      interceptors.beforeConsume?.(request);
    },
    afterConsume: (request: HttpRequest) => {
      defaultInterceptors.afterConsume?.(request);
      interceptors.afterConsume?.(request);
    },
    beforeResult: (result: unknown) => {
      defaultInterceptors.beforeResult?.(result);
      interceptors.beforeResult?.(result);
    },
    beforeError: (errorResponse: HttpErrorResponse) => {
      defaultInterceptors.beforeError?.(errorResponse);
      interceptors.beforeError?.(errorResponse);
    },
    beforeFinish: () => {
      defaultInterceptors.beforeFinish?.();
      interceptors.beforeFinish?.();
    }
  };
}
