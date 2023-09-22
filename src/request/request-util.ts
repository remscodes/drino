import { defaultSignal, mergeSignals, timedSignal } from '../features/abort/abort-util';
import { initInterceptors } from '../features/interceptors/interceptors-util';
import { defaultRetry } from '../features/retry/retry.constants';
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
        max: defaultMax = defaultRetry.max,
        useRetryAfter: defaultUseRetryAfter = defaultRetry.useRetryAfter,
        intervalMs: defaultIntervalMs = defaultRetry.intervalMs,
        onStatusCodes: defaultOnStatusCodes = defaultRetry.onStatusCodes,
        onMethods: defaultOnMethods = defaultRetry.onMethods
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
      max,
      useRetryAfter,
      intervalMs,
      onStatusCodes
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
      useRetryAfter: useRetryAfter ?? defaultUseRetryAfter,
      intervalMs: intervalMs ?? defaultIntervalMs,
      onStatusCodes: onStatusCodes ?? defaultOnStatusCodes,
      onMethods: defaultOnMethods
    },
    signal: (timeoutMs) ? mergeSignals(signal, timedSignal(timeoutMs))
      : (defaultTimeoutMs) ? mergeSignals(signal, timedSignal(defaultTimeoutMs))
        : signal
  };
}
