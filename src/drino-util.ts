import { mergeInterceptors } from './features/interceptors/interceptors-util';
import type { DrinoDefaultConfig, DrinoDefaultConfigInit, DrinoRetryConfigInit } from './models/drino.model';
import type { RequestMethodType } from './models/http.model';
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
        count: parentCount = 0,
        onStatusCodes: parentOnStatusCodes = { min: 400, max: 599 },
        onMethods: parentOnMethods = ['*'] as (RequestMethodType | '*')[]
      } = {} as Required<DrinoRetryConfigInit>
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
        count,
        onStatusCodes,
        onMethods
      } = {} as DrinoRetryConfigInit
    } = {}
  } = defaultConfig;

  return {
    baseUrl: baseUrl || parentBaseUrl,
    interceptors: mergeInterceptors(interceptors, parentInterceptors),
    requestsConfig: {
      prefix: prefix || parentPrefix,
      headers: mergeHeaders(headers, parentHeaders),
      queryParams: mergeQueryParams(queryParams, parentQueryParams),
      timeoutMs: timeoutMs || parentTimeoutMs,
      retry: {
        count: count ?? parentCount,
        onStatusCodes: onStatusCodes ?? parentOnStatusCodes,
        onMethods: onMethods ?? parentOnMethods
      }
    }
  };
}
