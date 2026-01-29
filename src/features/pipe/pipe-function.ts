import { RequestController } from '../../request';
import { Mapper, Observer } from '../../request/models/request-controller.model';
import { Pipeline } from './models/pipeline.model';

export function pipeToObserve<T>(observer: Partial<Observer<T>>): Pipeline<T> {
  return (source: RequestController<T>) => source.addObserver(observer);
}

export function pipeToMap<T1, T2>(mapper: Mapper<T1, T2>): Pipeline<T1, T2> {
  return (source: RequestController<T1>) => source.addMapper(mapper);
}
