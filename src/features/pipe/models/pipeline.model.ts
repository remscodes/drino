import { RequestController } from '../../../request';

export interface Pipeline<T1, T2 = T1> {
  (source: RequestController<T1>): RequestController<T2>;
}
