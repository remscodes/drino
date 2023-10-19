import type { DeepRequired } from '../../models/shared.model';
import type { ProgressConfig } from './models';

export const defaultProgress: DeepRequired<ProgressConfig> = {
  download: {
    inspect: false,
    // intervalMs: 0,
  },
};
