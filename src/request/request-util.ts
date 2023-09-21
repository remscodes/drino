import { defaultSignal, mergeSignals, timedSignal } from '../features/abort/abort-util';
import { initInterceptors } from '../features/interceptors/interceptors-util';
import { defaultRetryMax, defaultRetryOnMethods, defaultRetryOnStatusCodes } from '../features/retry/retry.constants';
import type { DrinoDefaultConfigInit } from '../models/drino.model';
import { mergeHeaders } from '../utils/headers-util';
import { mergeQueryParams } from '../utils/params-util';
import type { RequestConfig } from './models';
import type { RequestControllerConfig } from './models/request-config.model';

export function mergeRequestConfigs(requestConfig: RequestConfig<any, any>, defaultConfig: DrinoDefaultConfigInit): RequestControllerConfig {
  const {
    baseUrl = 'http://localhost',
    interceptors: defaultInterceptors = {},
    requestsConfig: {
      prefix: defaultPrefix = '/',
      headers: defaultHeaders = {},
      queryParams: defaultQueryParams = {},
      timeoutMs: defaultTimeoutMs = 0,
      retry: {
        max: defaultMax = defaultRetryMax,
        onStatusCodes: defaultOnStatusCodes = defaultRetryOnStatusCodes,
        onMethods: defaultOnMethods = defaultRetryOnMethods
      } = {}
    } = {}
  } = defaultConfig;

  const {
    prefix,
    headers = {},
    queryParams = {},
    read = 'object',
    wrapper = 'none',
    timeoutMs,
    signal = defaultSignal(),
    retry: {
      max = defaultRetryMax,
      onStatusCodes = defaultRetryOnStatusCodes
    } = {}
  } = requestConfig;

  return {
    baseUrl: new URL(baseUrl),
    prefix: prefix || defaultPrefix,
    headers: mergeHeaders(defaultHeaders, headers),
    queryParams: mergeQueryParams(defaultQueryParams, queryParams),
    read,
    wrapper,
    interceptors: initInterceptors(defaultInterceptors),
    retry: {
      max: max ?? defaultMax,
      retryAfterMs: 100,
      useRetryAfterHeader: true,
      onStatusCodes,
      onMethods: []
    },
    signal: (timeoutMs) ? mergeSignals(signal, timedSignal(timeoutMs))
      : (defaultTimeoutMs) ? mergeSignals(signal, timedSignal(defaultTimeoutMs))
        : signal
  };
}
