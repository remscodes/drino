import { defaultSignal, mergeSignals, timedSignal } from '../features/abort/abort-util';
import { defaultTimeout } from '../features/abort/abort.constants';
import { initInterceptors } from '../features/interceptors/interceptors-util';
import { defaultRetry } from '../features/retry/retry.constants';
import type { DrinoDefaultConfigInit } from '../models/drino.model';
import { mergeHeaders } from '../utils/headers-util';
import { mergeQueryParams } from '../utils/params-util';
import { createUrl } from '../utils/url-util';
import type { RequestConfig } from './models';
import type { RequestControllerConfig } from './models/request-config.model';
import { defaultBaseUrl, defaultPrefix, defaultRead, defaultWrapper } from './request.constants';

export function mergeRequestConfigs(requestConfig: RequestConfig<any, any>, defaultConfig: DrinoDefaultConfigInit): RequestControllerConfig {
  const {
    baseUrl = defaultBaseUrl,
    interceptors: instanceInterceptors = {},
    requestsConfig: {
      prefix: instancePrefix = defaultPrefix,
      headers: instanceHeaders = {},
      queryParams: instanceQueryParams = {},
      timeoutMs: instanceTimeoutMs = defaultTimeout,
      retry: {
        max: instanceMax = defaultRetry.max,
        useRetryAfter: instanceUseRetryAfter = defaultRetry.useRetryAfter,
        intervalMs: instanceIntervalMs = defaultRetry.intervalMs,
        onStatus: instanceOnStatus = defaultRetry.onStatus,
        onMethods: instanceOnMethods = defaultRetry.onMethods
      } = {}
    } = {}
  } = defaultConfig;

  const {
    prefix,
    headers = {},
    queryParams = {},
    read = defaultRead,
    wrapper = defaultWrapper,
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
    : (instanceTimeoutMs) ? mergeSignals(signal, timedSignal(instanceTimeoutMs))
      : mergeSignals(signal);

  return {
    baseUrl: createUrl(baseUrl),
    prefix: prefix || instancePrefix,
    headers: mergeHeaders(instanceHeaders, headers),
    queryParams: mergeQueryParams(instanceQueryParams, queryParams),
    read,
    wrapper,
    interceptors: initInterceptors(instanceInterceptors),
    retry: {
      max: max ?? instanceMax,
      useRetryAfter: useRetryAfter ?? instanceUseRetryAfter,
      intervalMs: intervalMs ?? instanceIntervalMs,
      onStatus: onStatus ?? instanceOnStatus,
      onMethods: instanceOnMethods
    },
    signal: mergedSignal,
    abortCtrl: mergedAbortCtrl
  };
}
