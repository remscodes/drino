import type { RequestMethodType } from '../../models/http.model';
import type { NumberRange } from '../../models/shared.model';
import type { RetryConfig } from './models';
import type { OnMethods, OnStatusCodes } from './models/retry.model';

export function needRetry(retryConfig: Required<RetryConfig>, status: number, method: RequestMethodType, retried: number): boolean {
  return (retried < retryConfig.max)
    && isStatusIncluded(retryConfig.onStatus, status)
    && isMethodIncluded(retryConfig.onMethods, method);
}

function isStatusIncluded(onStatus: OnStatusCodes, status: number): boolean {
  if (isNumberRange(onStatus)) {
    const { min, max } = onStatus;
    return (min <= status) && (status <= max);
  }

  if (!onStatus.length) return false;

  if (isNumberRangeArray(onStatus)) {
    return onStatus.some(({ min, max }) => (min <= status) && (status <= max));
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