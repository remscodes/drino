import { defaultSignal } from '../features/abort/abort-util';
import { mergeInterceptors } from '../features/interceptors/interceptors-util';
import type { DrinoDefaultConfigInit } from '../models/drino.model';
import { mergeHeaders } from '../utils/headers-util';
import { mergeQueryParams } from '../utils/params-util';
import type { RequestConfig } from './models';
import type { DefinedConfig } from './models/request-config.model';

export function mergeRequestConfigs(defaultConfig: DrinoDefaultConfigInit, requestConfig: RequestConfig<any, any>): DefinedConfig {
  const {
    urlOrigin = 'http://localhost',
    requestsConfig: {
      prefix: defaultPrefix = '/',
      headers: defaultHeaders = {},
      queryParams: defaultQueryParams = {},
      interceptors: defaultInterceptors = {}
    } = {}
  } = defaultConfig;

  const {
    prefix,
    headers = {},
    queryParams = {},
    read = 'object',
    wrapper = 'none',
    interceptors = {},
    signal = defaultSignal()
  } = requestConfig;

  return {
    baseUrl: new URL(urlOrigin),
    prefix: prefix || defaultPrefix,
    headers: mergeHeaders(defaultHeaders, headers),
    queryParams: mergeQueryParams(defaultQueryParams, queryParams),
    read,
    wrapper,
    interceptors: mergeInterceptors(defaultInterceptors, interceptors),
    signal
  };
}
