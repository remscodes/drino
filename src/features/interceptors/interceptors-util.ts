import { EMPTY_FN } from '../../utils/fn-util';
import type { Interceptors } from './models/interceptor.model';

export function initInterceptors(interceptors: Partial<Interceptors>): Interceptors {
  const {
    beforeConsume = EMPTY_FN,
    afterConsume = EMPTY_FN,
    beforeResult = EMPTY_FN,
    beforeError = EMPTY_FN,
    beforeFinish = EMPTY_FN,
  } = interceptors;

  return { beforeConsume, afterConsume, beforeResult, beforeError, beforeFinish };
}

export function mergeInterceptors(...interceptors: Partial<Interceptors>[]): Interceptors {
  return {
    beforeConsume: async (args) => {
      for (const interceptor of interceptors) await interceptor.beforeConsume?.(args);
    },
    afterConsume: async (args) => {
      for (const interceptor of interceptors) await interceptor.afterConsume?.(args);
    },
    beforeResult: async (args) => {
      for (const interceptor of interceptors) await interceptor.beforeResult?.(args);
    },
    beforeError: async (args) => {
      for (const interceptor of interceptors) await interceptor.beforeError?.(args);
    },
    beforeFinish: async (args) => {
      for (const interceptor of interceptors) await interceptor.beforeFinish?.(args);
    },
  };
}
