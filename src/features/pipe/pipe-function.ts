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
 * The returned function will add the observer to the RequestController's chain
 */
export function createPipeFromObserver<T1, T2 = T1>(observer: Partial<Observer<any>>): PipeFunction<T1, T2> {
  return (source: RequestController<T1>) => {
    return source.addObserver(observer) as unknown as RequestController<T2>;
  };
}

/**
 * Creates a pipe function from a modifier (transformation function)
 * The returned function will add the modifier to the RequestController to transform the result
 */
export function createPipeFromModifier<T1, T2>(modifier: Modifier<T1, T2>): PipeFunction<T1, T2> {
  return (source: RequestController<T1>) => {
    return source.addModifier(modifier);
  };
}
