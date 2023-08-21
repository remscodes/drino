import type { QueryParamsType } from '../models/http.model';

export function mergeQueryParams(...queryParamss: QueryParamsType[]): URLSearchParams {
  return queryParamss.reduce((finalQueryParams: URLSearchParams, queryParams: QueryParamsType) => {
    new URLSearchParams(queryParams).forEach((value: string, key: string) => finalQueryParams.set(key, value));
    return finalQueryParams;
  }, new URLSearchParams());
}
