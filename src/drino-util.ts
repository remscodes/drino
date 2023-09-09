import { mergeInterceptors } from './features/interceptors/interceptors-util';
import type { DrinoDefaultConfig, DrinoDefaultConfigInit } from './models/drino.model';
import { mergeHeaders } from './utils/headers-util';
import { mergeQueryParams } from './utils/params-util';

export function mergeInstanceConfig(defaultConfig: DrinoDefaultConfigInit, parentDefaultConfig: DrinoDefaultConfigInit): DrinoDefaultConfig {
  const {
    baseUrl: parentBaseUrl = 'http://localhost',
    interceptors: parentInterceptors = {},
    requestsConfig: {
      prefix: parentPrefix = '/',
      headers: parentHeaders = {},
      queryParams: parentQueryParams = {},
      timeoutMs: defaultTimeoutMs = 0
    } = {}
  } = parentDefaultConfig;

  const {
    baseUrl,
    interceptors = {},
    requestsConfig: {
      prefix,
      headers = {},
      queryParams = {},
      timeoutMs
    } = {}
  } = defaultConfig;

  return {
    baseUrl: baseUrl || parentBaseUrl,
    interceptors: mergeInterceptors(parentInterceptors, interceptors),
    requestsConfig: {
      prefix: prefix || parentPrefix,
      headers: mergeHeaders(parentHeaders, headers),
      queryParams: mergeQueryParams(parentQueryParams, queryParams),
      timeoutMs: timeoutMs || defaultTimeoutMs
    }
  };
}
