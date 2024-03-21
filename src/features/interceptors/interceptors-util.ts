import { EMPTY_FN, mergeVoidFns } from '../../utils/fn-util';
import type { Interceptors } from './models/interceptor.model';

export function initInterceptors(interceptors: Partial<Interceptors>): Interceptors {
  const { beforeConsume, afterConsume, beforeResult, beforeError, beforeFinish } = interceptors;
  return {
    beforeConsume: beforeConsume ?? EMPTY_FN,
    afterConsume: afterConsume ?? EMPTY_FN,
    beforeResult: beforeResult ?? EMPTY_FN,
    beforeError: beforeError ?? EMPTY_FN,
    beforeFinish: beforeFinish ?? EMPTY_FN,
  };
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
