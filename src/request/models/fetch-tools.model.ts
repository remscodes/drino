import type { Interceptors } from '../../features/interceptors/models/interceptor.model';
import type { InstanceRetryConfig } from '../../features/retry/models/retry-config.model';
import type { Observer } from './request-controller.model';

export interface FetchTools {
  abortCtrl: AbortController;
  interceptors: Interceptors;
  retry: Required<InstanceRetryConfig>;
  retryCb?: Observer<unknown>['retry'];
  dlCb?: Observer<unknown>['download'];
  fetch: typeof fetch;
  fetchInit: RequestInit;
}
