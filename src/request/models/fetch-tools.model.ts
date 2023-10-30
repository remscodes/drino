import type { Interceptors } from '../../features/interceptors/models/interceptor.model';
import type { ProgressConfig } from '../../features/progress/models/progress-config.model';
import type { InstanceRetryConfig } from '../../features/retry/models/retry-config.model';
import type { Observer } from './request-controller.model';

export interface FetchTools {
  abortCtrl: AbortController;
  interceptors: Interceptors;
  retry: Required<InstanceRetryConfig>;
  retryCb?: Observer<unknown>['retry'];
  progress: Required<ProgressConfig>;
  dlCb?: Observer<unknown>['downloadProgress'];
  // ulCb?: Observer<unknown>['uploadProgress'];
}
