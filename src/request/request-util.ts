import { defaultSignal, mergeSignals, timedSignal } from '../features/abort/abort-util';
import { DEFAULT_TIMEOUT } from '../features/abort/abort.constants';
import { initInterceptors } from '../features/interceptors/interceptors-util';
import { DEFAULT_PROGRESS } from '../features/progress/progress.constants';
import { DEFAULT_RETRY } from '../features/retry/retry.constants';
import type { DrinoDefaultConfigInit } from '../models/drino.model';
import { mergeHeaders } from '../utils/headers-util';
import { mergeQueryParams } from '../utils/params-util';
import { createUrl } from '../utils/url-util';
import type { RequestConfig } from './models';
import type { RequestControllerConfig } from './models/request-controller.model';
import { DEFAULT_BASE_URL, DEFAULT_PREFIX, DEFAULT_READ, DEFAULT_WRAPPER } from './request.constants';

export function mergeRequestConfigs(requestConfig: RequestConfig<any, any>, defaultConfig: DrinoDefaultConfigInit): RequestControllerConfig {
  const {
    baseUrl = DEFAULT_BASE_URL,
    interceptors: instanceInterceptors = {},
    requestsConfig: {
      prefix: instancePrefix = DEFAULT_PREFIX,
      headers: instanceHeaders = {},
      queryParams: instanceQueryParams = {},
      timeoutMs: instanceTimeoutMs = DEFAULT_TIMEOUT,
      progress: {
        download: {
          inspect: instanceDownloadInspect = DEFAULT_PROGRESS.download.inspect,
        } = {},
        // upload: {
        //   inspect: instanceUploadInspect = defaultProgress.upload.inspect,
        // } = {},
      } = {},
      retry: {
        max: instanceMax = DEFAULT_RETRY.max,
        withRetryAfter: instanceWithRetryAfter = DEFAULT_RETRY.withRetryAfter,
        withDelayMs: instanceWithDelayMs = DEFAULT_RETRY.withDelayMs,
        onStatus: instanceOnStatus = DEFAULT_RETRY.onStatus,
        onMethods: instanceOnMethods = DEFAULT_RETRY.onMethods,
      } = {},
    } = {},
  } = defaultConfig;

  const {
    prefix,
    headers = {},
    queryParams = {},
    read = DEFAULT_READ,
    wrapper = DEFAULT_WRAPPER,
    timeoutMs,
    signal = defaultSignal(),
    progress: {
      download: {
        inspect: downloadInspect = undefined,
      } = {},
      // upload: {
      //   inspect: uploadInspect = undefined,
      // } = {},
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
      },
      // upload: {
      //   inspect: uploadInspect ?? instanceUploadInspect,
      // },
    },
    retry: {
      max: max ?? instanceMax,
      withRetryAfter: withRetryAfter ?? instanceWithRetryAfter,
      withDelayMs: withDelayMs ?? instanceWithDelayMs,
      onStatus: onStatus ?? instanceOnStatus,
      onMethods: instanceOnMethods,
    },
    abortCtrl: (timeoutMs) ? mergeSignals(signal, timedSignal(timeoutMs))
      : (instanceTimeoutMs) ? mergeSignals(signal, timedSignal(instanceTimeoutMs))
        : mergeSignals(signal),
  };
}
