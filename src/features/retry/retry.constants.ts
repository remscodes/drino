import type { RetryConfig } from './models';

export const defaultRetry: Required<RetryConfig> = {
  max: 0,
  useRetryAfter: true,
  intervalMs: 100,
  onStatus: [408, 429, 503, 504],
  onMethods: '*'
};
