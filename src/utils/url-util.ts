import { emitError } from 'thror';
import type { Url } from '../models/http.model';
import type { Config } from '../request/models/request-config.model';

interface BuildUrlArgs extends Pick<Config, 'baseUrl' | 'prefix' | 'queryParams'> {
  url: Url;
}

export function buildUrl(args: BuildUrlArgs): URL {
  const {
    baseUrl,
    prefix,
    url,
    queryParams = {}
  } = args;

  let finalUrl: URL;

  if (hasOrigin(url)) {
    finalUrl = createUrl(url);
  }
  else if (hasOrigin(prefix)) {
    finalUrl = createUrl(prefix);
    buildPathname(finalUrl, url);
  }
  else {
    finalUrl = createUrl(baseUrl);
    buildPathname(finalUrl, `${prefix}/${url}`);
  }

  new URLSearchParams(queryParams).forEach((value: string, key: string) => {
    finalUrl.searchParams.set(key, value);
  });

  return finalUrl;
}

function buildPathname(finalUrl: URL, postPathname: Url): void {
  finalUrl.pathname = `${finalUrl.pathname}/${postPathname}`.replace(/\/{2,}/g, '/');
}

function createUrl(url: Url | string): URL {
  try {
    return new URL(url);
  }
  catch (err: any) {
    emitError('TypeError : Invalid URL', `${url}`, {
      withStack: true,
      original: err
    });
  }
}

function hasOrigin(url: Url): boolean {
  if (url instanceof URL) return true;
  return !!url.match(/http(s)?:\/\/[a-z0-9.]+(:\d{0,5})?/)?.length;
}
