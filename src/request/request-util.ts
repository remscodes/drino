import { defaultSignal, mergeSignals, timedSignal } from '../features/abort/abort-util';
import { mergeInterceptors } from '../features/interceptors/interceptors-util';
import type { DrinoDefaultConfigInit } from '../models/drino.model';
import { mergeHeaders } from '../utils/headers-util';
import { mergeQueryParams } from '../utils/params-util';
import type { RequestConfig } from './models';
import type { DefinedConfig } from './models/request-config.model';

export function mergeRequestConfigs(requestConfig: RequestConfig<any, any>, defaultConfig: DrinoDefaultConfigInit): DefinedConfig {
  const {
    baseUrl = 'http://localhost',
    requestsConfig: {
      prefix: defaultPrefix = '/',
      headers: defaultHeaders = {},
      queryParams: defaultQueryParams = {},
      interceptors: defaultInterceptors = {},
      timeoutMs: defaultTimeoutMs = 0
    } = {}
  } = defaultConfig;

  const {
    prefix,
    headers = {},
    queryParams = {},
    read = 'object',
    wrapper = 'none',
    interceptors = {},
    timeoutMs,
    signal = defaultSignal()
  } = requestConfig;

  return {
    baseUrl: new URL(baseUrl),
    prefix: prefix || defaultPrefix,
    headers: mergeHeaders(defaultHeaders, headers),
    queryParams: mergeQueryParams(defaultQueryParams, queryParams),
    read,
    wrapper,
    interceptors: mergeInterceptors(defaultInterceptors, interceptors),
    signal: (timeoutMs) ? mergeSignals(signal, timedSignal(timeoutMs))
      : (defaultTimeoutMs) ? mergeSignals(signal, timedSignal(defaultTimeoutMs))
        : signal
  };
}
