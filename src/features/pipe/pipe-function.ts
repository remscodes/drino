import { RequestController } from '../../request';
import { Modifier, Observer } from '../../request/models/request-controller.model';

/**
 * A pipe function transforms a RequestController into another RequestController
 * Similar to RxJS operators
 */
export interface PipeFunction<T1, T2> {
  (source: RequestController<T1>): RequestController<T2>;
}

/**
 * Creates a pipe function from an observer
 * The returned function will clone the source RequestController and add the observer to its chain
 */
export function createPipeFromObserver<T1, T2 = T1>(observer: Partial<Observer<any>>): PipeFunction<T1, T2> {
  return (source: RequestController<T1>) => {
    const cloned = source.clone<T2>();
    cloned.addObserver(observer);
    return cloned;
  };
}

/**
 * Creates a pipe function from a modifier (transformation function)
 * The returned function will clone the source RequestController and add the modifier to transform the result
 */
export function createPipeFromModifier<T1, T2>(modifier: Modifier<T1, T2>): PipeFunction<T1, T2> {
  return (source: RequestController<T1>) => {
    const cloned = source.clone<T2>();
    (cloned as any).modifiers.push(modifier);
    return cloned;
  };
}
