import type { DrinoInstance } from '../../src';
import drino from '../../src';
import { ErrorService } from '../fixtures/services/error-service';
import { expectEqual } from '../fixtures/utils/expect-util';

describe('Drino - Abort', () => {
  const service: ErrorService = new ErrorService();
  const abortReason: string = 'Too Long';

  let abortCtrl: AbortController;
  let signal: AbortSignal;

  beforeEach(() => {
    abortCtrl = new AbortController();
    signal = abortCtrl.signal;
  });

  it('should abort with controller and retrieve reason from Observer', (done: Mocha.Done) => {
    service.get408(3_000, signal).consume({
      result: () => {
        done('Test failed');
      },
      abort: (reason: string) => {
        expectEqual(reason, abortReason);
        done();
      }
    });

    abortCtrl.abort(abortReason);
  });

  it('should abort with controller and retrieve reason from Promise', (done: Mocha.Done) => {
    service.get408(3_000, signal).consume()
      .then(() => done('Test Failed'))
      .catch((err: any) => {
        if (!signal.aborted) return done('Test Failed');

        expectEqual(err.name, 'AbortError');
        expectEqual(signal.reason, abortReason);
        done();
      });

    abortCtrl.abort(abortReason);
  });

  it('should abort with timeout', (done: Mocha.Done) => {
    drino.head('http://localhost:8080/error/408/3000', { timeoutMs: 300 }).consume()
      .catch((err: any) => {
          expectEqual(err.name, 'TimeoutError');
          done();
        }
      );
  });

  // FIXME : Does not work during CI for Node 20 + Webkit
  it.skip('should abort by timeout instead of abort controller', (done: Mocha.Done) => {
    const instance: DrinoInstance = drino.create({
      baseUrl: 'http://localhost:8080',
      requestsConfig: {
        prefix: '/error',
        timeoutMs: 1_000
      }
    });

    const abortCtrl: AbortController = new AbortController();

    instance.head('/408/3000', { signal: abortCtrl.signal }).consume()
      .catch((err: any) => {
        expectEqual(err.name, 'TimeoutError');
        done();
      });

    setTimeout(() => abortCtrl.abort(), 2_000);
  });

  it('should abort by abort controller instead of timeout', (done: Mocha.Done) => {
    const abortCtrl: AbortController = new AbortController();

    drino.head('http://localhost:8080/error/408/3000', {
      timeoutMs: 1_000,
      signal: abortCtrl.signal
    }).consume().catch((err: any) => {
        expectEqual(err.name, 'AbortError');
        done();
      }
    );

    setTimeout(() => abortCtrl.abort(), 300);
  });
});
