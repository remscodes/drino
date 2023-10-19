import type { ProgressInspectionConfig } from '../features';
import { defaultSignal, mergeSignals, timedSignal } from '../features/abort/abort-util';
import { defaultTimeout } from '../features/abort/abort.constants';
import { initInterceptors } from '../features/interceptors/interceptors-util';
import { defaultProgress } from '../features/progress/progress.constants';
import { defaultRetry } from '../features/retry/retry.constants';
import type { DrinoDefaultConfigInit } from '../models/drino.model';
import { mergeHeaders } from '../utils/headers-util';
import { mergeQueryParams } from '../utils/params-util';
import { createUrl } from '../utils/url-util';
import type { RequestConfig } from './models';
import type { RequestControllerConfig } from './models/request-controller.model';
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
      progress: {
        download: {
          inspect: instanceDownloadInspect = defaultProgress.download.inspect,
          // intervalMs: instanceDownloadIntervalMs = defaultProgress.download.intervalMs,
        } = {} as ProgressInspectionConfig,
      } = {},
      retry: {
        max: instanceMax = defaultRetry.max,
        withRetryAfter: instanceWithRetryAfter = defaultRetry.withRetryAfter,
        withDelayMs: instanceWithDelayMs = defaultRetry.withDelayMs,
        onStatus: instanceOnStatus = defaultRetry.onStatus,
        onMethods: instanceOnMethods = defaultRetry.onMethods,
      } = {},
    } = {},
  } = defaultConfig;

  const {
    prefix,
    headers = {},
    queryParams = {},
    read = defaultRead,
    wrapper = defaultWrapper,
    timeoutMs,
    signal = defaultSignal(),
    progress: {
      download: {
        inspect: downloadInspect,
        // intervalMs: downloadIntervalMs,
      } = {} as ProgressInspectionConfig,
    } = {},
    retry: {
      max,
      withRetryAfter,
      withDelayMs,
      onStatus,
    } = {},
  } = requestConfig;

  return {
    baseUrl: createUrl(baseUrl),
    prefix: prefix ?? instancePrefix,
    headers: mergeHeaders(instanceHeaders, headers),
    queryParams: mergeQueryParams(instanceQueryParams, queryParams),
    read,
    wrapper,
    interceptors: initInterceptors(instanceInterceptors),
    progress: {
      download: {
        inspect: downloadInspect ?? instanceDownloadInspect,
        // intervalMs: downloadIntervalMs ?? instanceDownloadInstervalMs,
      },
    },
    retry: {
      max: max ?? instanceMax,
      withRetryAfter: withRetryAfter ?? instanceWithRetryAfter,
      withDelayMs: withDelayMs ?? instanceWithDelayMs,
      onStatus: onStatus ?? instanceOnStatus,
      onMethods: instanceOnMethods,
    },
    abortTools: (timeoutMs) ? mergeSignals(signal, timedSignal(timeoutMs))
      : (instanceTimeoutMs) ? mergeSignals(signal, timedSignal(instanceTimeoutMs))
        : mergeSignals(signal),
  };
}
