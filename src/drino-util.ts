import { DEFAULT_TIMEOUT } from './features/abort/abort.constants';
import { mergeInterceptors } from './features/interceptors/interceptors-util';
import { DEFAULT_PROGRESS } from './features/progress/progress.constants';
import { DEFAULT_RETRY } from './features/retry/retry.constants';
import type { DrinoDefaultConfig, DrinoDefaultConfigInit } from './models/drino.model';
import { DEFAULT_BASE_URL, DEFAULT_PREFIX } from './request/request.constants';
import { mergeHeaders } from './utils/headers-util';
import { mergeQueryParams } from './utils/params-util';

export function mergeInstanceConfig(defaultConfig: DrinoDefaultConfigInit, parentDefaultConfig?: DrinoDefaultConfig): DrinoDefaultConfig {
  const {
    baseUrl: parentBaseUrl = DEFAULT_BASE_URL,
    interceptors: parentInterceptors = {},
    requestsConfig: {
      prefix: parentPrefix = DEFAULT_PREFIX,
      headers: parentHeaders = {},
      queryParams: parentQueryParams = {},
      timeoutMs: parentTimeoutMs = DEFAULT_TIMEOUT,
      retry: {
        max: parentMax = DEFAULT_RETRY.max,
        withRetryAfter: parentWithRetryAfter = DEFAULT_RETRY.withRetryAfter,
        withDelayMs: parentDelayMs = DEFAULT_RETRY.withDelayMs,
        onStatus: parentOnStatus = DEFAULT_RETRY.onStatus,
        onMethods: parentOnMethods = DEFAULT_RETRY.onMethods,
      } = {},
      progress: {
        download: {
          inspect: parentDownloadInspect = DEFAULT_PROGRESS.download.inspect,
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
    interceptors: mergeInterceptors(parentInterceptors, interceptors),
    requestsConfig: {
      prefix: prefix ?? parentPrefix,
      headers: mergeHeaders(parentHeaders, headers),
      queryParams: mergeQueryParams(parentQueryParams, queryParams),
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
