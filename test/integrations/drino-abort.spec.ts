import { DrinoService } from '../fixtures/drino.service';
import { expectEqual } from '../fixtures/utils/expect-util';

describe('Drino - Abort', () => {
  const service: DrinoService = new DrinoService();

  let abortCtrl: AbortController;
  let signal: AbortSignal;

  const abortReason: string = 'Too Long';

  beforeEach(() => {
    abortCtrl = new AbortController();
    signal = abortCtrl.signal;
  });

  it('should abort with controller and retrieve reason from Observer', (done: Mocha.Done) => {
    service.longRequest(signal).consume({
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
    service.longRequest(signal).consume()
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
    service['client'].head('/request/long', { timeoutMs: 100 }).consume()
      .catch((err: any) => {
          expectEqual(err.name, 'TimeoutError');
          done();
        }
      );
  });
});
