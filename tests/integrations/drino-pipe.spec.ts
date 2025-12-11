import type { SinonSandbox, SinonSpy } from 'sinon';
import * as sinon from 'sinon';
import type { DrinoInstance } from '../../src';
import drino from '../../src';
import { mapResult } from '../../src/features/pipe/functions/map-result.pipe';
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

  describe('transform', () => {

    it('should transform result', async () => {
      const result = await instance
        .get<TestItem>('/1')
        .transform(res => res.name)
        .consume();

      expectType(result, 'string');
    });
  });

  describe('check', () => {

    it('should call check callback', async () => {
      function checkFn(_name: string) {}

      const spy: SinonSpy<[name: string], void> = sandbox.spy(checkFn);

      const requestCtrl = instance
        .get<TestItem>('/1')
        .check((result) => spy(result.name));

      expectToBeCalled(spy, 0);

      const result = await requestCtrl.consume();

      expectToBeCalled(spy);
      expectToBeCalledWith(spy, result.name);
    });
  });

  describe('report', () => {

    it('should call report callback', async () => {
      function reportFn(_error: any) {}

      const spy: SinonSpy<[error: any], void> = sandbox.spy(reportFn);

      const requestCtrl = instance
        .get('/404')
        .report((error) => spy(error));

      expectToBeCalled(spy, 0);

      try {
        await requestCtrl.consume();
      }
      catch (err) {
        expectToBeCalled(spy);
        expectToBeCalledWith(spy, err);
      }
    });
  });

  describe('finalize', () => {

    it('should call final callback', async () => {
      function finalizeFn() {}

      const spy: SinonSpy<[], void> = sandbox.spy(finalizeFn);

      const requestCtrl = instance.get('/1')
        .finalize(() => spy());

      expectToBeCalled(spy, 0);

      await requestCtrl.consume();

      expectToBeCalled(spy);
    });
  });

  describe('follow', () => {

    it('should chain another request controller', (done: Mocha.Done) => {
      const name: string = 'name';

      service
        .createItem(name)
        .follow((item: TestItem) => {
          expectProperty(item, 'name', 'string', name);
          expectProperty(item, 'id', 'number');
          return service.getOneItem(item.id!);
        })
        .consume({
          result: (item: TestItem) => {
            expectProperty(item, 'name', 'string', name);
            expectProperty(item, 'id', 'number');
            done();
          },
        });
    });
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

    it('should isolate cloned pipelines', async () => {
      const base = instance.get<TestItem>('/1');
      const pipe1 = base.pipe(mapResult(item => item.name));
      const pipe2 = base.pipe(mapResult(item => item.id));

      const result1 = await pipe1.consume();
      const result2 = await pipe2.consume();

      expectType(result1, 'string');
      expectType(result2, 'number');
    });

    it('should maintain isolation with multiple pipe operations', async () => {
      const base = instance.get<TestItem>('/1');

      // Create two different pipelines from the same base
      const pipeline1 = base.pipe(mapResult(item => item.name));
      const pipeline2 = base.pipe(mapResult(item => item.id));

      // Further extend pipeline1 without affecting pipeline2
      const extended1 = pipeline1.pipe(mapResult(name => name.toUpperCase()));

      const result1 = await extended1.consume();
      const result2 = await pipeline2.consume();
      const result3 = await pipeline1.consume(); // Original pipeline1 unchanged

      expectType(result1, 'string');
      expectType(result2, 'number');
      expectType(result3, 'string');
    });
  });
});
