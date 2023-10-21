import type { DeepRequired } from '../../models/shared.model';
import type { ProgressConfig } from './models';

export const defaultProgress: DeepRequired<ProgressConfig> = {
  download: {
    inspect: true,
  },
  // upload: {
  //   inspect: true,
  // },
};
