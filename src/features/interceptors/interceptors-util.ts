import { EMPTY_FN, mergeVoidFns } from '../../utils/fn-util';
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
    beforeConsume: mergeVoidFns(...interceptors.map(i => i.beforeConsume)),
    afterConsume: mergeVoidFns(...interceptors.map(i => i.afterConsume)),
    beforeResult: mergeVoidFns(...interceptors.map(i => i.beforeResult)),
    beforeError: mergeVoidFns(...interceptors.map(i => i.beforeError)),
    beforeFinish: mergeVoidFns(...interceptors.map(i => i.beforeFinish)),
  };
}
