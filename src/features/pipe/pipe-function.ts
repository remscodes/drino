import { RequestController } from '../../request';
import { Mapper, Observer } from '../../request/models/request-controller.model';
import { Pipeline } from './models/operator.model';

export function pipeFromObserver<T>(observer: Partial<Observer<T>>): Pipeline<T, T> {
  return (source: RequestController<T>) => source.addObserver(observer);
}

export function pipeFromModifier<T1, T2>(modifier: Mapper<T1, T2>): Pipeline<T1, T2> {
  return (source: RequestController<T1>) => source.addMapper(modifier);
}
