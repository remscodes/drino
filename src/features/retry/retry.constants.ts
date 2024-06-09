import type { InstanceRetryConfig } from './models/retry-config.model';

export const DEFAULT_RETRY: Required<InstanceRetryConfig> = {
  max: 0,
  withRetryAfter: true,
  delay: 0,
  onStatus: [408, 429, 503, 504],
  onMethods: '*',
};
