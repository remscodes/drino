import type { RetryConfig } from './features';
import { mergeInterceptors } from './features/interceptors/interceptors-util';
import { defaultRetryMax, defaultRetryOnMethods, defaultRetryOnStatusCodes } from './features/retry/retry.constants';
import type { DrinoDefaultConfig, DrinoDefaultConfigInit } from './models/drino.model';
import { mergeHeaders } from './utils/headers-util';
import { mergeQueryParams } from './utils/params-util';

export function mergeInstanceConfig(defaultConfig: DrinoDefaultConfigInit, parentDefaultConfig?: DrinoDefaultConfig): DrinoDefaultConfig {
  const {
    baseUrl: parentBaseUrl = 'http://localhost',
    interceptors: parentInterceptors = {},
    requestsConfig: {
      prefix: parentPrefix = '/',
      headers: parentHeaders = {},
      queryParams: parentQueryParams = {},
      timeoutMs: parentTimeoutMs = 0,
      retry: {
        max: parentMax = defaultRetryMax,
        onStatusCodes: parentOnStatusCodes = defaultRetryOnStatusCodes,
        onMethods: parentOnMethods = defaultRetryOnMethods
      } = {} as Required<RetryConfig>
    } = {}
  } = parentDefaultConfig ?? {};

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
        onStatusCodes,
        onMethods
      } = {} as RetryConfig
    } = {}
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
        useRetryAfterHeader: true,
        retryAfterMs: 100,
        onStatusCodes: onStatusCodes ?? parentOnStatusCodes,
        onMethods: onMethods ?? parentOnMethods
      }
    }
  };
}
