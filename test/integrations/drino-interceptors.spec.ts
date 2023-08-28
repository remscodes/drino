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
        baseUrl: 'http://localhost:8080/item'
      }
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should set default header before consume', (done: Mocha.Done) => {
    const { key, value } = { key: 'Cat-Mood', value: 'Good' };

    instance.default.requestsConfig.interceptors.beforeConsume = (request: HttpRequest) => {
      request.headers.set(key, value);
    };

    instance.get(`/1`, {
      interceptors: {
        beforeConsume: (request: HttpRequest) => {
          expectEqual(request.headers.get(key), value);
        }
      }
    }).consume({ finish: done });
  });

  it('should call function after consume', (done: Mocha.Done) => {
    function handle(_request: HttpRequest): void {}

    const spy: SinonSpy = sandbox.spy(handle);

    instance.default.requestsConfig.interceptors.afterConsume = (request: HttpRequest) => {
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
    function handle(_result: unknown): void {}

    const spy: SinonSpy = sandbox.spy(handle);

    instance.default.requestsConfig.interceptors.beforeResult = (result: any) => {
      spy(result);
    };

    instance.get('/1').consume({
      result: (result: unknown) => {
        expect(spy.calledOnceWithExactly(result)).to.be.true;
        done();
      }
    });

  });

  it('should call function before error', (done: Mocha.Done) => {
    function handleError(_errorResponse: HttpErrorResponse): void {}

    const spy: SinonSpy = sandbox.spy(handleError);

    instance.default.requestsConfig.interceptors.beforeError = (errorResponse: HttpErrorResponse) => {
      spy(errorResponse);
    };

    instance.get('/route/unknown').consume({
      error: (errorResponse: HttpErrorResponse) => {
        expect(spy.calledOnceWithExactly(errorResponse)).to.be.true;
        done();
      }
    });
  });

  it('should call function before finish', (done: Mocha.Done) => {
    function handle(): void {}

    const spy: SinonSpy = sandbox.spy(handle);

    instance.default.requestsConfig.interceptors.beforeFinish = () => {
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
