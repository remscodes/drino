import type { DeepRequired } from '../../models/shared.model';
import type { ProgressConfig } from './models/progress-config.model';

export const defaultProgress: DeepRequired<ProgressConfig> = {
  download: {
    inspect: true,
  },
  // upload: {
  //   inspect: true,
  // },
};
