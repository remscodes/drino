import { defaultSignal, mergeSignals, timedSignal } from '../features/abort/abort-util';
import { DEFAULT_TIMEOUT } from '../features/abort/abort.constants';
import { DEFAULT_HTTP_CONTEXT_CHAIN } from '../features/interceptors/context/http-context.constants';
import { initInterceptors } from '../features/interceptors/interceptors-util';
import { DEFAULT_RETRY } from '../features/retry/retry.constants';
import type { DrinoDefaultConfigInit } from '../models/drino.model';
import { mergeHeaders } from '../utils/headers-util';
import { mergeQueryParams } from '../utils/params-util';
import { createUrl } from '../utils/url-util';
import type { RequestConfig } from './models';
import type { RequestControllerConfig } from './models/request-controller.model';
import { DEFAULT_BASE_URL, DEFAULT_CACHE, DEFAULT_CREDENTIALS, DEFAULT_FETCH, DEFAULT_INTEGRITY, DEFAULT_KEEPALIVE, DEFAULT_MODE, DEFAULT_PREFIX, DEFAULT_PRIORITY, DEFAULT_READ, DEFAULT_REDIRECT, DEFAULT_REFERRER_POLICY, DEFAULT_WRAPPER } from './request.constants';

export function mergeRequestConfigs(requestConfig: RequestConfig<any, any>, defaultConfig: DrinoDefaultConfigInit): RequestControllerConfig {
  const {
    baseUrl = DEFAULT_BASE_URL,
    interceptors: instanceInterceptors = {},
    requestsConfig: {
      prefix: instancePrefix = DEFAULT_PREFIX,
      headers: instanceHeaders = {},
      queryParams: instanceQueryParams = {},
      context: instanceContext = DEFAULT_HTTP_CONTEXT_CHAIN,
      timeout: instanceTimeoutMs = DEFAULT_TIMEOUT,
      retry: {
        max: instanceMax = DEFAULT_RETRY.max,
        withRetryAfter: instanceWithRetryAfter = DEFAULT_RETRY.withRetryAfter,
        delay: instanceDelay = DEFAULT_RETRY.delay,
        onStatus: instanceOnStatus = DEFAULT_RETRY.onStatus,
        onMethods: instanceOnMethods = DEFAULT_RETRY.onMethods,
      } = {},
      fetch: instanceFetch = DEFAULT_FETCH,
      credentials: instanceCredentials = DEFAULT_CREDENTIALS,
      mode: instanceMode = DEFAULT_MODE,
      priority: instancePriority = DEFAULT_PRIORITY,
      cache: instanceCache = DEFAULT_CACHE,
      redirect: instanceRedirect = DEFAULT_REDIRECT,
      keepalive: instanceKeepalive = DEFAULT_KEEPALIVE,
      referrerPolicy: instanceReferrerPolicy = DEFAULT_REFERRER_POLICY,
      integrity: instanceIntegrity = DEFAULT_INTEGRITY,
    } = {},
  } = defaultConfig;

  const {
    prefix,
    headers = {},
    queryParams = {},
    context = DEFAULT_HTTP_CONTEXT_CHAIN,
    read = DEFAULT_READ,
    wrapper = DEFAULT_WRAPPER,
    timeout,
    signal = defaultSignal(),
    retry: {
      max,
      withRetryAfter,
      delay,
      onStatus,
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
  } = requestConfig;

  return {
    baseUrl: createUrl(baseUrl),
    prefix: prefix ?? instancePrefix,
    headers: mergeHeaders(instanceHeaders, headers),
    queryParams: mergeQueryParams(instanceQueryParams, queryParams),
    context: (ctx) => context(instanceContext(ctx)),
    read,
    wrapper,
    interceptors: initInterceptors(instanceInterceptors),
    retry: {
      max: max ?? instanceMax,
      withRetryAfter: withRetryAfter ?? instanceWithRetryAfter,
      delay: delay ?? instanceDelay,
      onStatus: onStatus ?? instanceOnStatus,
      onMethods: instanceOnMethods,
    },
    abortCtrl: (timeout) ? mergeSignals(signal, timedSignal(timeout))
      : (instanceTimeoutMs) ? mergeSignals(signal, timedSignal(instanceTimeoutMs))
        : mergeSignals(signal),
    fetch: reqFetch ?? instanceFetch,
    credentials: credentials ?? instanceCredentials,
    mode: mode ?? instanceMode,
    priority: priority ?? instancePriority,
    cache: cache ?? instanceCache,
    redirect: redirect ?? instanceRedirect,
    keepalive: keepalive ?? instanceKeepalive,
    referrerPolicy: referrerPolicy ?? instanceReferrerPolicy,
    integrity: integrity ?? instanceIntegrity,
  };
}
