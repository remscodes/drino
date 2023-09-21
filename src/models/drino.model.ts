import type { Drino } from '../drino';
import type { RetryConfig } from '../features';
import type { Interceptors } from '../features/interceptors/models/interceptor.model';
import type { RequestConfig } from '../request';
import type { RequestMethodType, Url } from './http.model';
import type { Prefix } from './shared.model';

export type DrinoInstance = Omit<Drino, 'create' | 'use'>

export interface DrinoDefaultConfigInit {
  baseUrl?: Exclude<Url, Prefix<string, '/'>>;
  /**
   * Interceptors.
   */
  interceptors?: Interceptors;
  requestsConfig?: DrinoRequestsConfigInit;
}

interface DrinoRequestsConfigInit extends Omit<RequestConfig<any, any>, 'read' | 'wrapper' | 'signal'> {
  retry?: DrinoRetryConfigInit;
}

export interface DrinoRetryConfigInit extends RetryConfig {
  onMethods?: (RequestMethodType | '*')[];
}

export interface DrinoDefaultConfig extends Omit<Required<DrinoDefaultConfigInit>, 'requestsConfig'> {
  requestsConfig: DrinoDefaultRequestsConfig;
}

export interface DrinoDefaultRequestsConfig extends Omit<Required<RequestConfig<any, any>>, 'read' | 'wrapper' | 'signal' | 'retry'> {
  retry: Required<DrinoRetryConfigInit>;
}
