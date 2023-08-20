import { emitError } from 'thror';
import type { DrinoDefaultConfig } from '../models/drino.model';
import type { Url } from '../models/http.model';
import type { RequestConfig } from '../request';

type BuildUrlArgs =
  & Pick<RequestConfig<any, any>, 'prefix' | 'queryParams'>
  & Pick<DrinoDefaultConfig, 'baseUrl'>
  & { url: Url }

export function buildUrl(args: BuildUrlArgs): URL {
  const {
    baseUrl,
    prefix = '/',
    url: path,
    queryParams = {}
  } = args;

  const inputUrl = `${(prefix === '/') ? '' : prefix}${path}`.replace(/\/$/, '');
  const url: URL = createUrl(inputUrl, baseUrl);

  const searchParams: URLSearchParams = new URLSearchParams(queryParams);
  searchParams.forEach((value: string, key: string) => {
    url.searchParams.set(key, value);
  });

  return url;
}

export function createUrl(url: Url | string, base?: Url): URL {
  try {
    return new URL(url, base);
  }
  catch (err: any) {
    emitError('URL Format', `Url is invalid : '${base ?? ''}' + '${url}' (baseUrl + url).`, {
      withStack: true,
      original: err
    });
  }
}
