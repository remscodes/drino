import type { Drino } from '../drino';
import type { RequestConfig } from '../request';
import type { Url } from './http.model';
import type { Prefix } from './shared.model';

export type DrinoInstance = Omit<Drino, 'create'>

export interface DrinoDefaultConfig {
  baseUrl?: Exclude<Url, Prefix<string, '/'>>;
  requestsConfig?: Omit<RequestConfig<any>, 'read' | 'wrapper' | ''>;
}
