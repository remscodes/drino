import type { RequestConfig } from './models';

export function mergeConfigs(defaultRequestConfig: RequestConfig<any, any>, requestConfig: RequestConfig<any, any>): RequestConfig<any, any> {
  return {
    ...defaultRequestConfig,
    ...requestConfig,
    interceptors: {
      ...defaultRequestConfig.interceptors ?? {},
      ...requestConfig.interceptors ?? {}
    }
  };
}
