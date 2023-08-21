import type { DrinoDefaultConfig } from '../models/drino.model';
import { mergeHeaders } from '../utils/headers-util';
import { mergeQueryParams } from '../utils/params-util';
import type { RequestConfig } from './models';
import type { DefinedConfig } from './models/request-config.model';

export function mergeConfigs(defaultConfig: DrinoDefaultConfig, requestConfig: RequestConfig<any, any>): DefinedConfig {
  const {
    baseUrl = 'http://localhost',
    requestsConfig: {
      headers: defaultHeaders = {},
      interceptors: defaultInterceptors = {},
      queryParams: defaultQueryParams = {},
      prefix: defaultPrefix = '/'
    } = {}
  } = defaultConfig;

  const {
    headers = {},
    interceptors = {},
    queryParams = {},
    prefix,
    read = 'object',
    wrapper = 'none',
    signal = new AbortController().signal
  } = requestConfig;

  return {
    baseUrl: new URL(baseUrl),
    headers: mergeHeaders(defaultHeaders, headers),
    queryParams: mergeQueryParams(defaultQueryParams, queryParams),
    prefix: prefix || defaultPrefix,
    read,
    wrapper,
    signal,
    interceptors: {
      ...defaultInterceptors,
      ...interceptors
    }
  };
}
