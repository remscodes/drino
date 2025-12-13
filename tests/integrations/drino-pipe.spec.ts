import type { SinonSandbox, SinonSpy } from 'sinon';
import * as sinon from 'sinon';
import type { DrinoInstance } from '../../src';
import drino, { mapResult, tap } from '../../src';
import type { TestItem } from '../fixtures/services/item-service';
import { ItemService } from '../fixtures/services/item-service';
import { expectProperty, expectToBeCalled, expectToBeCalledWith, expectType } from '../fixtures/utils/expect-util';

describe('Drino - Pipe Methods', () => {
  const sandbox: SinonSandbox = sinon.createSandbox();
  const service = new ItemService();

  let instance: DrinoInstance;

  beforeEach(() => {
    instance = drino.create({
      baseUrl: 'http://localhost:8080/item',
    });
  });

  afterEach(() => {
    sandbox.restore();
  });


  describe('pipe', () => {

    it('should pipe another request controller', async () => {
      const result = await instance.get<TestItem>('/1').pipe(
        mapResult((val) => val.name),
      ).consume();

      expectType(result, 'string');
    });

    it('should allow pipeline reuse', async () => {
      const pipeline = instance.get<TestItem>('/1').pipe(
        mapResult(item => item.name),
      );

      const result1 = await pipeline.consume();
      const result2 = await pipeline.consume();

      expectType(result1, 'string');
      expectType(result2, 'string');
      expectProperty({ result1, result2 }, 'result1', 'string', result2);
    });

    it('should be immutable - original instance unchanged after pipe', async () => {
      const req = instance.get<TestItem>('/1');

      // Pipe returns a new instance, doesn't modify req
      const piped = req.pipe(mapResult(item => item.name));

      // Original instance should return the full item, not just the name
      const result = await req.consume();

      expectType(result, 'object');
      expectProperty(result, 'name', 'string');
      expectProperty(result, 'id', 'number');

      // Piped instance should return only the name
      const pipedResult = await piped.consume();
      expectType(pipedResult, 'string');
    });

    it('should allow chaining multiple pipe operations', async () => {
      const result = await instance.get<TestItem>('/1')
        .pipe(
          mapResult(item => item.name),
          mapResult((name: string) => name.toUpperCase())
        )
        .consume();

      expectType(result, 'string');
    });
  });

  describe('tap', () => {

    it('should call result callback without modifying result', async () => {
      function tapResultFn(_item: TestItem) {}

      const spy: SinonSpy<[item: TestItem], void> = sandbox.spy(tapResultFn);

      const result = await instance
        .get<TestItem>('/1')
        .pipe(
          tap({
            result: (item) => spy(item)
          })
        )
        .consume();

      expectToBeCalled(spy);
      expectToBeCalledWith(spy, result);
      expectProperty(result, 'name', 'string');
      expectProperty(result, 'id', 'number');
    });

    it('should call error callback', async () => {
      function tapErrorFn(_error: any) {}

      const spy: SinonSpy<[error: any], void> = sandbox.spy(tapErrorFn);

      try {
        await instance
          .get('/404')
          .pipe(
            tap({
              error: (error) => spy(error)
            })
          )
          .consume();
      }
      catch (err) {
        expectToBeCalled(spy);
        expectToBeCalledWith(spy, err);
      }
    });

    it('should call finish callback', async () => {
      function tapFinishFn() {}

      const spy: SinonSpy<[], void> = sandbox.spy(tapFinishFn);

      await instance
        .get<TestItem>('/1')
        .pipe(
          tap({
            finish: () => spy()
          })
        )
        .consume();

      expectToBeCalled(spy);
    });

    it('should call multiple callbacks in observer', async () => {
      function tapResultFn(_item: TestItem) {}
      function tapFinishFn() {}

      const resultSpy: SinonSpy<[item: TestItem], void> = sandbox.spy(tapResultFn);
      const finishSpy: SinonSpy<[], void> = sandbox.spy(tapFinishFn);

      const result = await instance
        .get<TestItem>('/1')
        .pipe(
          tap({
            result: (item) => resultSpy(item),
            finish: () => finishSpy()
          })
        )
        .consume();

      expectToBeCalled(resultSpy);
      expectToBeCalledWith(resultSpy, result);
      expectToBeCalled(finishSpy);
    });

    it('should work with other pipe operators', async () => {
      function tapResultFn(_item: TestItem) {}

      const spy: SinonSpy<[item: TestItem], void> = sandbox.spy(tapResultFn);

      const result = await instance
        .get<TestItem>('/1')
        .pipe(
          tap({
            result: (item) => spy(item)
          }),
          mapResult(item => item.name)
        )
        .consume();

      expectToBeCalled(spy);
      expectType(result, 'string');
    });
  });
});
