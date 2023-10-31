import type { Url } from '../models/http.model';
import type { ReadType, WrapperType } from './models/request-config.model';

export const defaultBaseUrl: Url = 'http://localhost';

export const defaultPrefix: string = '/';

export const defaultRead: ReadType = 'object';

export const defaultWrapper: WrapperType = 'none';
