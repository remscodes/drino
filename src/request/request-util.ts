import { defaultSignal } from '../features/abort/abort-util';
import { mergeInterceptors } from '../features/interceptors/interceptors-util';
import type { DrinoDefaultConfig } from '../models/drino.model';
import { mergeHeaders } from '../utils/headers-util';
import { mergeQueryParams } from '../utils/params-util';
import type { RequestConfig } from './models';
import type { DefinedConfig } from './models/request-config.model';

export function mergeConfigs(defaultConfig: DrinoDefaultConfig, requestConfig: RequestConfig<any, any>): DefinedConfig {
  const {
    urlOrigin = 'http://localhost',
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
    signal = defaultSignal()
  } = requestConfig;

  return {
    baseUrl: new URL(urlOrigin),
    prefix: prefix || defaultPrefix,
    headers: mergeHeaders(defaultHeaders, headers),
    queryParams: mergeQueryParams(defaultQueryParams, queryParams),
    interceptors: mergeInterceptors(defaultInterceptors, interceptors),
    read,
    wrapper,
    signal
  };
}
