import type { InstanceRetryConfig } from './models/retry-config.model';

export const defaultRetry: Required<InstanceRetryConfig> = {
  max: 0,
  withRetryAfter: true,
  withDelayMs: 0,
  onStatus: [408, 429, 503, 504],
  onMethods: '*'
};
