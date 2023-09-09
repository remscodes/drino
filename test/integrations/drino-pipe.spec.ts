import type { SinonSandbox, SinonSpy } from 'sinon';
import sinon from 'sinon';
import type { DrinoInstance } from '../../src';
import drino from '../../src';
import type { TestItem } from '../fixtures/drino.service';
import { expectToBeCalled, expectToBeCalledWith, expectType } from '../fixtures/utils/expect-util';

describe('Drino - Pipe Methods', () => {
  const sandbox: SinonSandbox = sinon.createSandbox();

  const client: DrinoInstance = drino.create({
    baseUrl: 'http://localhost:8080/item'
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('transform', () => {

    it('should transform result', async () => {
      const result = await client
        .get<TestItem>('/1')
        .transform(res => res.name)
        .consume();

      expectType(result, 'string');
    });
  });

  describe('check', () => {

    it('should call check callback', async () => {
      function checkFn(_name: string) {}

      const spy: SinonSpy = sandbox.spy(checkFn);

      const requestCtrl = client
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

      const spy: SinonSpy = sandbox.spy(reportFn);

      const requestCtrl = client
        .get('/error/401')
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

      const spy: SinonSpy = sandbox.spy(finalizeFn);

      const requestCtrl = client.get('/1')
        .finalize(() => spy());

      expectToBeCalled(spy, 0);

      await requestCtrl.consume();

      expectToBeCalled(spy);
    });
  });
});
