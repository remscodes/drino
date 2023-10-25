import type { Drino } from '../drino';
import type { Interceptors } from '../features/interceptors/models/interceptor.model';
import type { ProgressConfig } from '../features/progress/models/progress-config.model';
import type { InstanceRetryConfig } from '../features/retry/models/retry-config.model';
import type { RequestConfig } from '../request';
import type { Url } from './http.model';
import type { DeepRequired, Prefix } from './shared.model';

export type DrinoInstance = Omit<Drino, 'create' | 'use'>

export interface DrinoDefaultConfigInit {
  baseUrl?: Exclude<Url, Prefix<string, '/'>>;
  interceptors?: Partial<Interceptors>;
  requestsConfig?: DrinoDefaultRequestsConfigInit;
}

export interface DrinoDefaultRequestsConfigInit extends Omit<RequestConfig<any, any>, 'read' | 'wrapper' | 'signal' | 'retry'> {
  retry?: InstanceRetryConfig;
}

export interface DrinoDefaultConfig extends Required<Omit<DrinoDefaultConfigInit, 'requestsConfig'>> {
  requestsConfig: DrinoDefaultRequestsConfig;
}

export interface DrinoDefaultRequestsConfig extends Required<Omit<RequestConfig<any, any>, 'read' | 'wrapper' | 'signal' | 'retry' | 'progress'>> {
  retry: Required<InstanceRetryConfig>;
  progress: DeepRequired<ProgressConfig>;
}
