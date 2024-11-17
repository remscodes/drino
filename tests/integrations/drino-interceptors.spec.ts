import type { SinonSandbox, SinonSpy } from 'sinon';
import * as sinon from 'sinon';
import type { DrinoInstance, HttpErrorResponse, HttpResponse } from '../../src';
import drino from '../../src';
import { HttpContextToken } from '../../src/features/interceptors/context/http-context-token';
import type { AfterConsumeArgs, BeforeFinishArgs, BeforeResultArgs } from '../../src/features/interceptors/models/interceptor.model';
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

      const requestCtrl = instance.get<TestItem>('/1');
      const { headers } = requestCtrl.request;

      await requestCtrl.consume();

      expectEqual(headers.get(key), value);
    });

    it('should set default header before consume because of context', async () => {
      const key = 'Cat-Mood';
      const value = 'Good';

      instance.default.interceptors.beforeConsume = ({ req, ctx }) => {
        const hasToSet = ctx.get(headerSetToken);
        if (hasToSet) req.headers.set(key, value);
      };

      const requestCtrl = instance.get<TestItem>('/1');
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

      const requestCtrl = instance.get<TestItem>('/1', {
        context: (ctx) => ctx.set(headerSetToken, false),
      });
      const { headers } = requestCtrl.request;

      await requestCtrl.consume();

      expectNotEqual(headers.get(key), value);
    });

    it('should abort request in before consume', (done: Mocha.Done) => {
      const abortReason = 'cancelled';

      instance.default.interceptors.beforeConsume = ({ abort }) => abort(abortReason);

      const abortCtrl = new AbortController();
      const { signal } = abortCtrl;

      instance.get<TestItem>('/1', { signal }).consume({
        abort: (reason) => {
          expectEqual(reason, abortReason);
          done();
        },
      });
    });
  });

  describe('afterConsume', () => {

    it('should call function after consume', (done: Mocha.Done) => {
      function handle({}: AfterConsumeArgs): void {}

      const spy: SinonSpy<[args: AfterConsumeArgs], void> = sandbox.spy(handle);

      instance.default.interceptors.afterConsume = (args) => spy(args);

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
      function handle(_res: HttpResponse<any>): void {}

      const spy: SinonSpy<[res: HttpResponse<any>], void> = sandbox.spy(handle);

      instance.default.interceptors.beforeResult = (args: BeforeResultArgs) => spy(args.res);

      instance.get('/1', { wrapper: 'response' }).consume({
        result: (res: HttpResponse<unknown>) => {
          expectToBeCalledWith(spy, res);
          done();
        },
      });
    });
  });

  describe('beforeError', () => {

    it('should call function before error', (done: Mocha.Done) => {
      function handleError(_errRes: HttpErrorResponse): void {}

      const spy: SinonSpy<[errRes: HttpErrorResponse], void> = sandbox.spy(handleError);

      instance.default.interceptors.beforeError = (args) => spy(args.errRes);

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
      function handle({}: BeforeFinishArgs): void {}

      const spy: SinonSpy<[args: BeforeFinishArgs], void> = sandbox.spy(handle);

      instance.default.interceptors.beforeFinish = (args) => spy(args);

      instance.get('/1').consume({
        finish: () => {
          expectToBeCalled(spy);
          done();
        },
      });
    });
  });
});
