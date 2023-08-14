import type { Drino } from '../drino';
import type { RequestConfig } from '../request';
import type { Url } from './http.model';

export type DrinoInstance = Omit<Drino, 'create'>

export interface DrinoDefaultConfig {
  baseUrl?: Url;
  requestConfig?: RequestConfig<any>;
}
