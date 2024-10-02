import { emitError } from 'thror';
import type { Url } from '../models/http.model';
import type { Prefix } from '../models/shared.model';
import type { RequestControllerConfig } from '../request/models/request-controller.model';

interface BuildUrlArgs extends Pick<RequestControllerConfig, 'baseUrl' | 'prefix' | 'queryParams'> {
  url: Url;
}

export function buildUrl(args: BuildUrlArgs): URL {
  const { baseUrl, prefix, url, queryParams } = args;

  let finalUrl: URL;

  if (hasOrigin(url)) {
    finalUrl = createUrl(url);
  }
  else if (hasOrigin(prefix)) {
    finalUrl = createUrl(prefix);
    extendPathname(finalUrl, url);
  }
  else {
    finalUrl = createUrl(baseUrl);
    extendPathname(finalUrl, `${prefix}/${url}`);
  }

  queryParams.forEach((value: string, key: string) => {
    finalUrl.searchParams.set(key, value);
  });

  return finalUrl;
}

function extendPathname(finalUrl: URL, extraPathname: Url): void {
  finalUrl.pathname = `${finalUrl.pathname}/${extraPathname}`.replace(/\/{2,}/g, '/');
}

export function createUrl(url: Url): URL {
  try {
    return new URL(url);
  }
  catch (err: unknown) {
    emitError('DrinoUrlException', `Invalid URL: '${url}'.`, {
      withStack: true,
      original: err,
    });
  }
}

function hasOrigin(url: Url): url is URL | Prefix<string, `http${'s' | ''}://`> {
  return (url instanceof URL) ? true
    : !!url.match(/http(s)?:\/\/[a-z0-9.]+(:\d{0,5})?/)?.length;
}
