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
      await Promise.all(interceptors.map(i => i.beforeConsume?.(args)));
    },
    afterConsume: async (args) => {
      await Promise.all(interceptors.map(i => i.afterConsume?.(args)));
    },
    beforeResult: async (args) => {
      await Promise.all(interceptors.map(i => i.beforeResult?.(args)));
    },
    beforeError: async (args) => {
      await Promise.all(interceptors.map(i => i.beforeError?.(args)));
    },
    beforeFinish: async (args) => {
      await Promise.all(interceptors.map(i => i.beforeFinish?.(args)));
    },
  };
}
