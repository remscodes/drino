import { PipeBuilder } from '../../request/pipe-builder';
import { RequestController } from '../../request';
import { Modifier, Observer } from '../../request/models/request-controller.model';

/**
 * A pipe function transforms a RequestController or PipeBuilder into a PipeBuilder
 * Similar to RxJS operators
 */
export interface PipeFunction<T1, T2> {
  (source: RequestController<T1> | PipeBuilder<T1>): PipeBuilder<T2>;
}

/**
 * Creates a pipe function from an observer
 * The returned function will convert the source to a PipeBuilder and add the observer to its chain
 */
export function createPipeFromObserver<T1, T2 = T1>(observer: Partial<Observer<any>>): PipeFunction<T1, T2> {
  return (source: RequestController<T1> | PipeBuilder<T1>) => {
    const builder = source instanceof PipeBuilder ? source : source.clone<T1>();
    return builder.addObserver(observer) as unknown as PipeBuilder<T2>;
  };
}

/**
 * Creates a pipe function from a modifier (transformation function)
 * The returned function will convert the source to a PipeBuilder and add the modifier to transform the result
 */
export function createPipeFromModifier<T1, T2>(modifier: Modifier<T1, T2>): PipeFunction<T1, T2> {
  return (source: RequestController<T1> | PipeBuilder<T1>) => {
    const builder = source instanceof PipeBuilder ? source : source.clone<T1>();
    return builder.addModifier(modifier);
  };
}
