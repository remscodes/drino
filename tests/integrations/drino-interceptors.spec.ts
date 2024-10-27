import type { SinonSandbox, SinonSpy } from 'sinon';
import * as sinon from 'sinon';
import type { DrinoInstance, HttpErrorResponse, HttpRequest } from '../../src';
import drino from '../../src';
import { HttpContextToken } from '../../src/features/interceptors/context/http-context-token';
import type { TestItem } from '../fixtures/services/item-service';
import { expectEqual, expectNotEqual, expectToBeCalled, expectToBeCalledWith } from '../fixtures/utils/expect-util';

describe('Drino - Interceptors', () => {
  const sandbox: SinonSandbox = sinon.createSandbox();
  const headerSetToken = new HttpContextToken(() => true);

  let instance: DrinoInstance;

  beforeEach(() => {
    instance = drino.create({
      baseUrl: 'http://localhost:8080/item',
      requestsConfig: {
        context: (ctx) => ctx.set(headerSetToken, true),

      },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('beforeConsume', () => {

    it('should set default header before consume', async () => {
      const key = 'Cat-Mood';
      const value = 'Good';

      instance.default.interceptors.beforeConsume = ({ req }) => req.headers.set(key, value);

      const requestCtrl = instance.get<TestItem>(`/1`);
      const { headers } = requestCtrl.request;

      await requestCtrl.consume();

      expectEqual(headers.get(key), value);
    });

    it('should set default header before consume', async () => {
      const key = 'Cat-Mood';
      const value = 'Good';

      instance.default.interceptors.beforeConsume = ({ req, ctx }) => {
        const hasToSet = ctx.get(headerSetToken);
        if (hasToSet) req.headers.set(key, value);
      };

      const requestCtrl = instance.get<TestItem>(`/1`);
      const { headers } = requestCtrl.request;

      await requestCtrl.consume();

      expectEqual(headers.get(key), value);
    });

    it('should not set default header before consume because of context', async () => {
      const key = 'Cat-Mood';
      const value = 'Good';

      instance.default.interceptors.beforeConsume = ({ req, ctx }) => {
        if (ctx.get(headerSetToken)) req.headers.set(key, value);
      };

      const requestCtrl = instance.get<TestItem>(`/1`, {
        context: (ctx) => ctx.set(headerSetToken, false),
      });
      const { headers } = requestCtrl.request;

      await requestCtrl.consume();

      expectNotEqual(headers.get(key), value);
    });
  });

  describe('afterConsume', () => {

    it('should call function after consume', (done: Mocha.Done) => {
      function handle(_req: HttpRequest): void {}

      const spy: SinonSpy<[req: HttpRequest], void> = sandbox.spy(handle);

      instance.default.interceptors.afterConsume = ({ req, res, ok }) => {
        spy(req);
      };

      instance.get('/').consume({
        finish: () => {
          expectToBeCalled(spy);
          done();
        },
      });
    });
  });

  describe('beforeResult', () => {

    it('should call function before result', (done: Mocha.Done) => {
      function handle(_req: unknown): void {}

      const spy: SinonSpy<[res: unknown], void> = sandbox.spy(handle);

      instance.default.interceptors.beforeResult = (res: any) => spy(res);

      instance.get('/1').consume({
        result: (res: unknown) => {
          expectToBeCalledWith(spy, res);
          done();
        },
      });
    });
  });

  describe('beforeError', () => {

    it('should call function before error', (done: Mocha.Done) => {
      function handleError(_errorResponse: HttpErrorResponse): void {}

      const spy: SinonSpy<[errorResponse: HttpErrorResponse], void> = sandbox.spy(handleError);

      instance.default.interceptors.beforeError = ({ errRes }) => spy(errRes);

      instance.get('/route/unknown').consume({
        error: (errRes: HttpErrorResponse) => {
          expectToBeCalledWith(spy, errRes);
          done();
        },
      });
    });
  });

  describe('beforeFinish', () => {

    it('should call function before finish', (done: Mocha.Done) => {
      function handle(): void {}

      const spy: SinonSpy<[], void> = sandbox.spy(handle);

      instance.default.interceptors.beforeFinish = () => spy();

      instance.get('/1').consume({
        finish: () => {
          expectToBeCalled(spy);
          done();
        },
      });
    });
  });
});
