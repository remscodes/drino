import { emitError } from 'thror';
import type { Url } from '../models/http.model';
import type { DefinedConfig } from '../request/models/request-config.model';

interface BuildUrlArgs extends Pick<DefinedConfig, 'baseUrl' | 'prefix' | 'queryParams'> {
  url: Url;
}

export function buildUrl(args: BuildUrlArgs): URL {
  const {
    baseUrl,
    prefix = '/',
    url: path,
    queryParams = {}
  } = args;

  const urlInput = `${prefix.replace(/^\/$/, '')}${path}`.replace(/\/$/, '');
  const url: URL = createUrl(urlInput, baseUrl);

  new URLSearchParams(queryParams).forEach((value: string, key: string) => {
    url.searchParams.set(key, value);
  });

  return url;
}

export function createUrl(url: Url | string, base?: Url): URL {
  try {
    return new URL(url, base);
  }
  catch (err: any) {
    emitError('URL Format', `Url is invalid : '${base ?? ''}' + '${url}' (base + url).`, {
      withStack: true,
      original: err
    });
  }
}
