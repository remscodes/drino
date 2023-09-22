import type { SinonSandbox, SinonSpy } from 'sinon';
import sinon from 'sinon';
import type { DrinoInstance, HttpErrorResponse, HttpRequest, RequestController } from '../../src';
import drino from '../../src';
import type { TestItem } from '../fixtures/services/item-service';
import { expectEqual, expectToBeCalled, expectToBeCalledWith } from '../fixtures/utils/expect-util';

describe('Drino - Interceptors', () => {
  const sandbox: SinonSandbox = sinon.createSandbox();

  let instance: DrinoInstance;

  beforeEach(() => {
    instance = drino.create({
      baseUrl: 'http://localhost:8080/item'
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('beforeConsume', () => {

    it('should set default header before consume', async () => {
      const { key, value } = { key: 'Cat-Mood', value: 'Good' };

      instance.default.interceptors.beforeConsume = (request: HttpRequest) => {
        request.headers.set(key, value);
      };

      const requestCtrl: RequestController<TestItem> = instance.get(`/1`);
      const headers: Headers = requestCtrl['request'].headers;

      await requestCtrl.consume();

      expectEqual(headers.get(key), value);
    });
  });

  describe('afterConsume', () => {

    it('should call function after consume', (done: Mocha.Done) => {
      function handle(_request: HttpRequest): void {}

      const spy: SinonSpy = sandbox.spy(handle);

      instance.default.interceptors.afterConsume = (request: HttpRequest) => {
        spy(request);
      };

      instance.get('/').consume({
        finish: () => {
          expectToBeCalled(spy);
          done();
        }
      });
    });
  });

  describe('beforeResult', () => {

    it('should call function before result', (done: Mocha.Done) => {
      function handle(_result: unknown): void {}

      const spy: SinonSpy = sandbox.spy(handle);

      instance.default.interceptors.beforeResult = (result: any) => {
        spy(result);
      };

      instance.get('/1').consume({
        result: (result: unknown) => {
          expectToBeCalledWith(spy, result);
          done();
        }
      });
    });
  });

  describe('beforeError', () => {

    it('should call function before error', (done: Mocha.Done) => {
      function handleError(_errorResponse: HttpErrorResponse): void {}

      const spy: SinonSpy = sandbox.spy(handleError);

      instance.default.interceptors.beforeError = (errorResponse: HttpErrorResponse) => {
        spy(errorResponse);
      };

      instance.get('/route/unknown').consume({
        error: (errorResponse: HttpErrorResponse) => {
          expectToBeCalledWith(spy, errorResponse);
          done();
        }
      });
    });
  });

  describe('beforeFinish', () => {

    it('should call function before finish', (done: Mocha.Done) => {
      function handle(): void {}

      const spy: SinonSpy = sandbox.spy(handle);

      instance.default.interceptors.beforeFinish = () => {
        spy();
      };

      instance.get('/1').consume({
        finish: () => {
          expectToBeCalled(spy);
          done();
        }
      });
    });
  });
});
