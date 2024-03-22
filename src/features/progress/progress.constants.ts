import type { DeepRequired } from '../../models/shared.model';
import type { ProgressConfig } from './models/progress-config.model';

export const DEFAULT_PROGRESS: DeepRequired<ProgressConfig> = {
  download: { inspect: true },
  // upload: { inspect: true },
};
