import type { Url } from '../models/http.model';
import type { ReadType, WrapperType } from './models/request-config.model';

export const DEFAULT_BASE_URL: Url = 'http://localhost';

export const DEFAULT_PREFIX: string = '/';

export const DEFAULT_READ: ReadType = 'auto';

export const DEFAULT_WRAPPER: WrapperType = 'none';

export const DEFAULT_FETCH: typeof fetch = fetch;

export const DEFAULT_CREDENTIALS: RequestCredentials = 'same-origin';

export const DEFAULT_MODE: RequestMode = 'cors';

export const DEFAULT_PRIORITY: RequestPriority = 'auto';

export const DEFAULT_CACHE: RequestCache = 'default';

export const DEFAULT_REDIRECT: RequestRedirect = 'follow';

export const DEFAULT_KEEPALIVE: boolean = false;

export const DEFAULT_REFERRER_POLICY: ReferrerPolicy = 'origin-when-cross-origin';

export const DEFAULT_INTEGRITY: string = "";
