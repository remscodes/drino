import { READ_OBJECT } from '../constants/read.constants';
import { WRAPPER_NONE } from '../constants/wrapper.constants';
import type { Url } from '../models/http.model';
import type { ReadType, WrapperType } from './models/request-config.model';

export const DEFAULT_BASE_URL: Url = 'http://localhost';

export const DEFAULT_PREFIX: string = '/';

export const DEFAULT_READ: ReadType = READ_OBJECT;

export const DEFAULT_WRAPPER: WrapperType = WRAPPER_NONE;
