import { DEFAULT_TIMEOUT } from './features/abort/abort.constants';
import { DEFAULT_HTTP_CONTEXT_CHAIN } from './features/interceptors/context/http-context.constants';
import { mergeInterceptors } from './features/interceptors/interceptors-util';
import { DEFAULT_RETRY } from './features/retry/retry.constants';
import type { DrinoDefaultConfig, DrinoDefaultConfigInit } from './models/drino.model';
import { DEFAULT_BASE_URL, DEFAULT_CACHE, DEFAULT_CREDENTIALS, DEFAULT_FETCH, DEFAULT_INTEGRITY, DEFAULT_KEEPALIVE, DEFAULT_MODE, DEFAULT_PREFIX, DEFAULT_PRIORITY, DEFAULT_REDIRECT, DEFAULT_REFERRER_POLICY } from './request/request.constants';
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
      context: parentContext = DEFAULT_HTTP_CONTEXT_CHAIN,
      timeout: parentTimeout = DEFAULT_TIMEOUT,
      retry: {
        max: parentMax = DEFAULT_RETRY.max,
        withRetryAfter: parentWithRetryAfter = DEFAULT_RETRY.withRetryAfter,
        delay: parentDelay = DEFAULT_RETRY.delay,
        onStatus: parentOnStatus = DEFAULT_RETRY.onStatus,
        onMethods: parentOnMethods = DEFAULT_RETRY.onMethods,
      } = {},
      fetch: parentFetch = DEFAULT_FETCH,
      credentials: parentCredentials = DEFAULT_CREDENTIALS,
      mode: parentMode = DEFAULT_MODE,
      priority: parentPriority = DEFAULT_PRIORITY,
      cache: parentCache = DEFAULT_CACHE,
      redirect: parentRedirect = DEFAULT_REDIRECT,
      keepalive: parentKeepalive = DEFAULT_KEEPALIVE,
      referrerPolicy: parentReferrerPolicy = DEFAULT_REFERRER_POLICY,
      integrity: parentIntegrity = DEFAULT_INTEGRITY,
    } = {},
  } = parentDefaultConfig ?? {};

  const {
    baseUrl,
    interceptors = {},
    requestsConfig: {
      prefix,
      headers = {},
      queryParams = {},
      context = DEFAULT_HTTP_CONTEXT_CHAIN,
      timeout,
      retry: {
        max,
        withRetryAfter,
        delay,
        onStatus,
        onMethods,
      } = {},
      fetch: reqFetch,
      credentials,
      mode,
      priority,
      cache,
      redirect,
      keepalive,
      referrerPolicy,
      integrity,
    } = {},
  } = defaultConfig;

  return {
    baseUrl: baseUrl ?? parentBaseUrl,
    interceptors: mergeInterceptors(parentInterceptors, interceptors),
    requestsConfig: {
      prefix: prefix ?? parentPrefix,
      headers: mergeHeaders(parentHeaders, headers),
      queryParams: mergeQueryParams(parentQueryParams, queryParams),
      context: (ctx) => context(parentContext(ctx)),
      timeout: timeout ?? parentTimeout,
      retry: {
        max: max ?? parentMax,
        withRetryAfter: withRetryAfter ?? parentWithRetryAfter,
        delay: delay ?? parentDelay,
        onStatus: onStatus ?? parentOnStatus,
        onMethods: onMethods ?? parentOnMethods,
      },
      fetch: reqFetch ?? parentFetch,
      credentials: credentials ?? parentCredentials,
      mode: mode ?? parentMode,
      priority: priority ?? parentPriority,
      cache: cache ?? parentCache,
      redirect: redirect ?? parentRedirect,
      keepalive: keepalive ?? parentKeepalive,
      referrerPolicy: referrerPolicy ?? parentReferrerPolicy,
      integrity: integrity ?? parentIntegrity,
    },
  };
}
