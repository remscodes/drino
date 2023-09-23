import type { RetryConfig } from './features';
import { defaultTimeout } from './features/abort/abort.constants';
import { mergeInterceptors } from './features/interceptors/interceptors-util';
import { defaultRetry } from './features/retry/retry.constants';
import type { DrinoDefaultConfig, DrinoDefaultConfigInit, DrinoDefaultRequestsConfig, DrinoRequestsConfigInit } from './models/drino.model';
import { defaultBaseUrl, defaultPrefix } from './request/request.constants';
import { mergeHeaders } from './utils/headers-util';
import { mergeQueryParams } from './utils/params-util';

export function mergeInstanceConfig(defaultConfig: DrinoDefaultConfigInit, parentDefaultConfig?: DrinoDefaultConfig): DrinoDefaultConfig {
  const {
    baseUrl: parentBaseUrl = defaultBaseUrl,
    interceptors: parentInterceptors = {},
    requestsConfig: {
      prefix: parentPrefix = defaultPrefix,
      headers: parentHeaders = {},
      queryParams: parentQueryParams = {},
      timeoutMs: parentTimeoutMs = defaultTimeout,
      retry: {
        max: parentMax = defaultRetry.max,
        useRetryAfter: parentUseRetryAfter = defaultRetry.useRetryAfter,
        intervalMs: parentIntervalMs = defaultRetry.intervalMs,
        onStatus: parentOnStatus = defaultRetry.onStatus,
        onMethods: parentOnMethods = defaultRetry.onMethods
      } = {} as Required<RetryConfig>
    } = {} as DrinoDefaultRequestsConfig
  } = parentDefaultConfig ?? {} as DrinoDefaultConfig;

  const {
    baseUrl,
    interceptors = {},
    requestsConfig: {
      prefix,
      headers = {},
      queryParams = {},
      timeoutMs,
      retry: {
        max,
        useRetryAfter,
        intervalMs,
        onStatus,
        onMethods
      } = {} as RetryConfig
    } = {} as DrinoRequestsConfigInit
  } = defaultConfig;

  return {
    baseUrl: baseUrl || parentBaseUrl,
    interceptors: mergeInterceptors(interceptors, parentInterceptors),
    requestsConfig: {
      prefix: prefix || parentPrefix,
      headers: mergeHeaders(headers, parentHeaders),
      queryParams: mergeQueryParams(queryParams, parentQueryParams),
      timeoutMs: timeoutMs ?? parentTimeoutMs,
      retry: {
        max: max ?? parentMax,
        useRetryAfter: useRetryAfter ?? parentUseRetryAfter,
        intervalMs: intervalMs ?? parentIntervalMs,
        onStatus: onStatus ?? parentOnStatus,
        onMethods: onMethods ?? parentOnMethods
      }
    }
  };
}
