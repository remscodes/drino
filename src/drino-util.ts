import { defaultTimeout } from './features/abort/abort.constants';
import { mergeInterceptors } from './features/interceptors/interceptors-util';
import { defaultProgress } from './features/progress/progress.constants';
import { defaultRetry } from './features/retry/retry.constants';
import type { DrinoDefaultConfig, DrinoDefaultConfigInit } from './models/drino.model';
import { defaultBaseUrl, defaultPrefix } from './request/request.constants';
import { mergeHeaders } from './utils/headers-util';
import { mergeQueryParams } from './utils/params-util';

export function mergeInstanceConfig(defaultConfig: DrinoDefaultConfigInit, parentDefaultConfig?: DrinoDefaultConfig): DrinoDefaultConfig {
  const {
    baseUrl: parentBaseUrl = defaultBaseUrl,
    interceptors: parentInterceptors = {},
    requestsConfig: {
      prefix: parentPrefix = defaultPrefix,
      headers: parentHeaders = {},
      queryParams: parentQueryParams = {},
      timeoutMs: parentTimeoutMs = defaultTimeout,
      retry: {
        max: parentMax = defaultRetry.max,
        withRetryAfter: parentWithRetryAfter = defaultRetry.withRetryAfter,
        withDelayMs: parentDelayMs = defaultRetry.withDelayMs,
        onStatus: parentOnStatus = defaultRetry.onStatus,
        onMethods: parentOnMethods = defaultRetry.onMethods,
      } = {},
      progress: {
        download: {
          inspect: parentDownloadInspect = defaultProgress.download.inspect,
        } = {},
        // upload: {
        //   inspect: parentUploadInspect = defaultProgress.upload.inspect,
        // } = {},
      } = {},
    } = {},
  } = parentDefaultConfig ?? {};

  const {
    baseUrl,
    interceptors = {},
    requestsConfig: {
      prefix,
      headers = {},
      queryParams = {},
      timeoutMs,
      retry: {
        max = undefined,
        withRetryAfter = undefined,
        withDelayMs = undefined,
        onStatus = undefined,
        onMethods = undefined,
      } = {},
      progress: {
        download: {
          inspect: downloadInspect = undefined,
        } = {},
        // upload: {
        //   inspect: uploadInspect = undefined,
        // } = {},
      } = {},
    } = {},
  } = defaultConfig;

  return {
    baseUrl: baseUrl ?? parentBaseUrl,
    interceptors: mergeInterceptors(interceptors, parentInterceptors),
    requestsConfig: {
      prefix: prefix ?? parentPrefix,
      headers: mergeHeaders(headers, parentHeaders),
      queryParams: mergeQueryParams(queryParams, parentQueryParams),
      timeoutMs: timeoutMs ?? parentTimeoutMs,
      progress: {
        download: {
          inspect: downloadInspect ?? parentDownloadInspect,
        },
        // upload: {
        //   inspect: uploadInspect ?? parentUploadInspect,
        // },
      },
      retry: {
        max: max ?? parentMax,
        withRetryAfter: withRetryAfter ?? parentWithRetryAfter,
        withDelayMs: withDelayMs ?? parentDelayMs,
        onStatus: onStatus ?? parentOnStatus,
        onMethods: onMethods ?? parentOnMethods,
      },
    },
  };
}
