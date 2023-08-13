import { emitError } from 'thror';
import type { DrinoConfig } from '../models/drino.model';
import type { Url } from '../models/http.model';
import type { RequestConfig } from '../request/models/request-config.model';
import { keysOf } from './object-util';

export function buildUrl(url: Url, config: RequestConfig<any>, defaultConfig: DrinoConfig): URL {
  const { baseUrl } = defaultConfig;
  const { prefix, queryParams } = config;

  const finalUrl: URL = new URL(url, baseUrl ?? prefix);
  if (queryParams && (queryParams?.size || keysOf(queryParams).length)) {
    const searchParams: URLSearchParams = (queryParams instanceof URLSearchParams)
      ? queryParams
      : new URLSearchParams(queryParams);

    searchParams.forEach((value: string, key: string) => {
      finalUrl.searchParams.set(key, value);
    });
  }
  return finalUrl;
}

export function createUrl(url: Url | string, base?: Url): URL {
  try {
    return new URL(url, base);
  }
  catch (err: any) {
    emitError('URL Format', `Url is invalid : "${base ?? ''}" + "${url}" (baseUrl + url).`, {
      original: err,
      withStack: true
    });
  }
}
