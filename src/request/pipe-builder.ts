import type { PipeFunction } from '../features';
import type { DrinoParentConfig } from '../models/drino.model';
import type { RequestMethodType, Url } from '../models/http.model';
import type { RequestConfig } from './models';
import type { Modifier, Observer } from './models/request-controller.model';
import { RequestController } from './request-controller';

interface DrinoRequestInit {
  method: RequestMethodType;
  url: Url;
  body?: any;
  config?: RequestConfig<any, any>;
}

interface PendingOperation {
  type: 'modifier' | 'observer';
  payload: Modifier<any, any> | Partial<Observer<any>>;
}

/**
 * Lightweight builder that accumulates pipe operations without creating RequestController instances.
 * The RequestController is only materialized when consume() or build() is called.
 */
export class PipeBuilder<Resource> {
  constructor(
    private readonly init: DrinoRequestInit,
    private readonly defaultConfig: DrinoParentConfig,
    private readonly operations: PendingOperation[] = []
  ) {}

  /**
   * Adds a pipe operation to the chain without creating a new instance
   * @internal
   */
  public addModifier<NewResource>(modifier: Modifier<Resource, NewResource>): PipeBuilder<NewResource> {
    return new PipeBuilder<NewResource>(
      this.init,
      this.defaultConfig,
      [...this.operations, { type: 'modifier', payload: modifier }]
    );
  }

  /**
   * Adds an observer to the chain without creating a new instance
   * @internal
   */
  public addObserver(observer: Partial<Observer<Resource>>): PipeBuilder<Resource> {
    return new PipeBuilder<Resource>(
      this.init,
      this.defaultConfig,
      [...this.operations, { type: 'observer', payload: observer }]
    );
  }

  /**
   * Pipe operators style RxJS. Allows chaining of PipeFunction operators.
   * @example
   * request.pipe(
   *   mapResult(x => x * 2),
   *   reportError(err => console.error(err))
   * )
   */
  public pipe(): PipeBuilder<Resource>;
  public pipe<NewResource>(op1: PipeFunction<Resource, NewResource>): PipeBuilder<NewResource>;
  public pipe<A, B>(op1: PipeFunction<Resource, A>, op2: PipeFunction<A, B>): PipeBuilder<B>;
  public pipe<A, B, C>(op1: PipeFunction<Resource, A>, op2: PipeFunction<A, B>, op3: PipeFunction<B, C>): PipeBuilder<C>;
  public pipe<A, B, C, D>(op1: PipeFunction<Resource, A>, op2: PipeFunction<A, B>, op3: PipeFunction<B, C>, op4: PipeFunction<C, D>): PipeBuilder<D>;
  public pipe<A, B, C, D, E>(op1: PipeFunction<Resource, A>, op2: PipeFunction<A, B>, op3: PipeFunction<B, C>, op4: PipeFunction<C, D>, op5: PipeFunction<D, E>): PipeBuilder<E>;
  public pipe(...operators: PipeFunction<any, any>[]): PipeBuilder<any> {
    if (operators.length === 0) return this;

    return operators.reduce((source, operator) => operator(source), this as PipeBuilder<any>);
  }

  /**
   * Materializes a RequestController with all accumulated operations applied.
   * This is the only place where a RequestController instance is created.
   */
  public build(): RequestController<Resource> {
    const controller = new RequestController<Resource>(this.init, this.defaultConfig);

    // Apply all accumulated operations
    for (const operation of this.operations) {
      if (operation.type === 'modifier') {
        (controller as any).ensureModifiersOwned();
        (controller as any).modifiers.push(operation.payload as Modifier<any, any>);
      } else {
        controller.addObserver(operation.payload as Partial<Observer<any>>);
      }
    }

    return controller;
  }

  /**
   * Materializes the RequestController and consumes it immediately.
   * This is a convenience method equivalent to build().consume()
   */
  public consume(): Promise<Resource>;
  public consume(observer: Observer<Resource>): void;
  public consume(observer?: Observer<Resource>): Promise<Resource> | void {
    const controller = this.build();
    return observer ? controller.consume(observer) : controller.consume();
  }

  /**
   * Provides access to the request object for inspection.
   * Note: This creates a temporary RequestController to access the request.
   */
  public get request() {
    return this.build().request;
  }
}
