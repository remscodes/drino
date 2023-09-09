import type { HttpRequest } from '../../request';
import type { HttpErrorResponse } from '../../response';
import type { Interceptors } from './models/interceptor.model';

export function mergeInterceptors(defaultInterceptors: Interceptors, interceptors: Interceptors): Required<Interceptors> {
  return {
    beforeConsume: (request: HttpRequest) => {
      defaultInterceptors.beforeConsume?.(request);
      interceptors.beforeConsume?.(request);
    },
    afterConsume: (request: HttpRequest, response: Response) => {
      defaultInterceptors.afterConsume?.(request, response);
      interceptors.afterConsume?.(request, response);
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

export function initInterceptors(interceptors: Interceptors): Required<Interceptors> {
  return {
    beforeConsume: (request: HttpRequest) => {
      interceptors.beforeConsume?.(request);
    },
    afterConsume: (request: HttpRequest, response: Response) => {
      interceptors.afterConsume?.(request, response);
    },
    beforeResult: (result: unknown) => {
      interceptors.beforeResult?.(result);
    },
    beforeError: (errorResponse: HttpErrorResponse) => {
      interceptors.beforeError?.(errorResponse);
    },
    beforeFinish: () => {
      interceptors.beforeFinish?.();
    }
  };
}
