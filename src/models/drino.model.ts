import type { Drino } from '../drino';
import type { Interceptors } from '../features/interceptors/models/interceptor.model';
import type { InstanceRetryConfig } from '../features/retry/models/retry-config.model';
import type { RequestConfig } from '../request';
import type { Url } from './http.model';

export type DrinoInstance = Omit<Drino, 'create' | 'use'>

export interface DrinoConfig {
  baseUrl?: Url;
  interceptors?: Partial<Interceptors>;
  requestsConfig?: DrinoDefaultRequestsConfigInit;
}

export interface DrinoDefaultRequestsConfigInit extends Omit<RequestConfig<any, any>, 'read' | 'wrapper' | 'signal' | 'retry'> {
  retry?: InstanceRetryConfig;
}

export interface DrinoParentConfig extends Required<Omit<DrinoConfig, 'requestsConfig'>> {
  requestsConfig: DrinoDefaultRequestsConfig;
}

export interface DrinoDefaultRequestsConfig extends Required<Omit<RequestConfig<any, any>, 'read' | 'wrapper' | 'signal' | 'retry' | 'progress'>> {
  retry: Required<InstanceRetryConfig>;
}
