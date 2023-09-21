import type { Drino } from '../drino';
import type { RetryConfig } from '../features';
import type { Interceptors } from '../features/interceptors/models/interceptor.model';
import type { RequestConfig } from '../request';
import type { Url } from './http.model';
import type { Prefix } from './shared.model';

export type DrinoInstance = Omit<Drino, 'create' | 'use'>

export interface DrinoDefaultConfigInit {
  baseUrl?: Exclude<Url, Prefix<string, '/'>>;
  interceptors?: Partial<Interceptors>;
  requestsConfig?: DrinoRequestsConfigInit;
}

interface DrinoRequestsConfigInit extends Omit<RequestConfig<any, any>, 'read' | 'wrapper' | 'signal' | 'retry'> {
  retry?: RetryConfig;
}

export interface DrinoDefaultConfig extends Required<Omit<DrinoDefaultConfigInit, 'requestsConfig'>> {
  requestsConfig: DrinoDefaultRequestsConfig;
}

export interface DrinoDefaultRequestsConfig extends Required<Omit<RequestConfig<any, any>, 'read' | 'wrapper' | 'signal' | 'retry'>> {
  retry: Required<RetryConfig>;
}
