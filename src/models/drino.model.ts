import type { Drino } from '../drino';
import type { RequestConfig } from '../request/models/request-config.model';
import type { Url } from './http.model';

export type DrinoInstance = Omit<Drino, 'create'>

export interface DrinoConfig {
  baseUrl?: Url;
  requestConfig?: RequestConfig<any>;
}
