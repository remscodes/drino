import type { RetryConfig } from './models';

export const defaultRetry: Required<RetryConfig> = {
  max: 0,
  withRetryAfter: true,
  withDelayMs: 0,
  onStatus: [408, 429, 503, 504],
  onMethods: '*'
};
