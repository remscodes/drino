import { RequestController } from '../../request';
import { Modifier, Observer } from '../../request/models/request-controller.model';

/**
 * A pipe function transforms a RequestController by mutating it
 * Similar to RxJS operators
 */
export interface PipeFunction<T1, T2> {
  (source: RequestController<T1>): RequestController<T2>;
}

/**
 * Creates a pipe function from an observer
 * The returned function will add the observer to a cloned RequestController
 * Observers don't change the type, so T1 and T2 are the same
 */
export function createPipeFromObserver<T>(observer: Partial<Observer<T>>): PipeFunction<T, T> {
  return (source: RequestController<T>) => source.addObserver(observer);
}

/**
 * Creates a pipe function from a modifier
 * The returned function will add the modifier to the RequestController to transform the result
 */
export function createPipeFromModifier<T1, T2>(modifier: Modifier<T1, T2>): PipeFunction<T1, T2> {
  return (source: RequestController<T1>) => source.addModifier(modifier);
}
