import { expect } from '@esm-bundle/chai';
import type { SinonSandbox, SinonSpy } from 'sinon';
import sinon from 'sinon';
import type { DrinoInstance, HttpErrorResponse, HttpRequest } from '../../src';
import drino from '../../src';
import { expectEqual } from '../fixtures/utils/expect-util';

describe('Drino - Interceptors', () => {
  const sandbox: SinonSandbox = sinon.createSandbox();

  let instance: DrinoInstance;

  beforeEach(() => {
    instance = drino.create({
        urlOrigin: 'http://localhost:8080',
        requestsConfig: {
          prefix: '/item',
          interceptors: {}
        }
      }
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should set default header before consume', (done: Mocha.Done) => {
    const customHeader = { key: 'Cat-Mood', value: 'Good' };

    instance.default.requestsConfig!.interceptors!.beforeConsume = (request: HttpRequest) => {
      const { key, value } = customHeader;
      request.headers.set(key, value);
    };

    instance.get(`/1`, {
      interceptors: {
        beforeConsume: (request: HttpRequest) => {
          expectEqual(request.headers.get(customHeader.key), customHeader.value);
        }
      }
    }).consume({ finish: done });
  });

  it('should call function after consume', (done: Mocha.Done) => {
    function handle(_request: HttpRequest): void {}

    const spy: SinonSpy = sandbox.spy(handle);

    instance.default.requestsConfig!.interceptors!.afterConsume = (request: HttpRequest) => {
      spy(request);
    };

    instance.get('/').consume({
      finish: () => {
        expect(spy.called).to.be.true;
        done();
      }
    });
  });

  it('should call function before result', (done: Mocha.Done) => {
    function handle(result: any): void {}

    const spy = sandbox.spy(handle);

    instance.default.requestsConfig!.interceptors!.beforeResult = (result: any) => {
      spy(result);
    };

    instance.get('/1').consume({
      result: (result: any) => {
        expect(spy.calledOnceWithExactly(result)).to.be.true;
        done();
      }
    });

  });

  it('should call function before error', (done: Mocha.Done) => {
    function handleError(_errorResponse: HttpErrorResponse): void {}

    const spy: SinonSpy = sandbox.spy(handleError);

    instance.default.requestsConfig!.interceptors!.beforeError = (errorResponse: HttpErrorResponse) => {
      spy(errorResponse);
    };

    instance.get('/unknown_route').consume({
      error: (errorResponse: HttpErrorResponse) => {
        expect(spy.calledOnceWithExactly(errorResponse)).to.be.true;
        done();
      }
    });
  });

  it('should call function before finish', (done: Mocha.Done) => {
    function handle(): void {}

    const spy = sandbox.spy(handle);

    instance.default.requestsConfig!.interceptors!.beforeFinish = () => {
      spy();
    };

    instance.get('/1').consume({
      finish: () => {
        expect(spy.called).to.be.true;
        done();
      }
    });
  });
});
