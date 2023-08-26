import { mergeInterceptors } from './features/interceptors/interceptors-util';
import type { DrinoDefaultConfig, DrinoDefaultConfigInit } from './models/drino.model';
import { mergeHeaders } from './utils/headers-util';
import { mergeQueryParams } from './utils/params-util';

export function mergeInstanceConfig(defaultConfig: DrinoDefaultConfigInit, parentDefaultConfig: DrinoDefaultConfigInit): DrinoDefaultConfig {
  const {
    urlOrigin,
    requestsConfig: {
      prefix,
      headers = {},
      queryParams = {},
      interceptors = {},
      timeoutMs
    } = {}
  } = defaultConfig;

  const {
    urlOrigin: parentUrlOrigin = 'http://localhost',
    requestsConfig: {
      prefix: parentPrefix = '/',
      headers: parentHeaders = {},
      queryParams: parentQueryParams = {},
      interceptors: parentInterceptors = {},
      timeoutMs: defaultTimeoutMs = 0
    } = {}
  } = parentDefaultConfig;

  return {
    urlOrigin: urlOrigin || parentUrlOrigin,
    requestsConfig: {
      prefix: prefix || parentPrefix,
      headers: mergeHeaders(parentHeaders, headers),
      queryParams: mergeQueryParams(parentQueryParams, queryParams),
      interceptors: mergeInterceptors(parentInterceptors, interceptors),
      timeoutMs: timeoutMs || defaultTimeoutMs
    }
  };
}
