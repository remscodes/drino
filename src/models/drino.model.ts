import type { Drino } from '../drino';
import type { RequestConfig } from '../request';
import type { Url } from './http.model';
import type { Prefix } from './shared.model';

export type DrinoInstance = Omit<Drino, 'create'>

export interface DrinoDefaultConfigInit {
  baseUrl?: Exclude<Url, Prefix<string, '/'>>;
  requestsConfig?: Omit<RequestConfig<any, any>, 'read' | 'wrapper' | 'signal'>;
}

export interface DrinoDefaultConfig extends Omit<Required<DrinoDefaultConfigInit>, 'requestsConfig'> {
  requestsConfig: Omit<Required<RequestConfig<any, any>>, 'read' | 'wrapper' | 'signal'>;
}
