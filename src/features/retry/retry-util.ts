import type { RequestMethodType } from '../../models/http.model';
import type { NumberRange } from '../../models/shared.model';
import type { RetryConfig } from './models';
import type { OnMethods, OnStatusCodes } from './models/retry.model';

export function needRetry(retryConfig: Required<RetryConfig>, status: number, method: RequestMethodType, retried: number, abortCtrl: AbortController): boolean {
  return (retried < retryConfig.max)
    && isStatusIncluded(retryConfig.onStatus, status)
    && isMethodIncluded(retryConfig.onMethods, method)
    && !abortCtrl.signal.aborted;
}

function isStatusIncluded(onStatus: OnStatusCodes, status: number): boolean {
  if (isNumberRange(onStatus)) {
    const { start, end }: NumberRange = onStatus;
    return (start <= status) && (status <= end);
  }

  if (!onStatus.length) return false;

  if (isNumberRangeArray(onStatus)) {
    return onStatus.some(({ start, end }: NumberRange) => (start <= status) && (status <= end));
  }

  return onStatus.includes(status);
}

function isMethodIncluded(onMethods: OnMethods, method: RequestMethodType): boolean {
  return (onMethods === '*')
    || onMethods.includes(method);
}

function isNumberRange(value: any): value is NumberRange {
  return (!!value.min)
    && (!!value.max);
}

function isNumberRangeArray(value: any[]): value is NumberRange[] {
  return isNumberRange(value?.at(0));
}
