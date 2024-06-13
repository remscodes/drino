import type { QueryParamsType } from '../models';
import { mergeMapsLike } from './map-util';

export function mergeQueryParams(...manyQueryParams: QueryParamsType[]): URLSearchParams {
  return mergeMapsLike(URLSearchParams, ...manyQueryParams);
}
