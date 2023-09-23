import { defaultSignal, mergeSignals, timedSignal } from '../features/abort/abort-util';
import { initInterceptors } from '../features/interceptors/interceptors-util';
import { defaultRetry } from '../features/retry/retry.constants';
import type { DrinoDefaultConfigInit } from '../models/drino.model';
import { mergeHeaders } from '../utils/headers-util';
import { mergeQueryParams } from '../utils/params-util';
import { createUrl } from '../utils/url-util';
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
        onStatus: defaultOnStatus = defaultRetry.onStatus,
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
      onStatus
    } = {}
  } = requestConfig;

  const {
    signal: mergedSignal,
    abortCtrl: mergedAbortCtrl
  } = (timeoutMs) ? mergeSignals(signal, timedSignal(timeoutMs))
    : (defaultTimeoutMs) ? mergeSignals(signal, timedSignal(defaultTimeoutMs))
      : mergeSignals(signal);

  return {
    baseUrl: createUrl(baseUrl),
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
      onStatus: onStatus ?? defaultOnStatus,
      onMethods: defaultOnMethods
    },
    signal: mergedSignal,
    abortCtrl: mergedAbortCtrl
  };
}
