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

  it('should abort and retrieve reason from Observer', (done: Mocha.Done) => {
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

  it('should abort and retrieve reason from Promise', (done: Mocha.Done) => {
    async function request(): Promise<void> {
      try {
        await service.longRequest(signal).consume();
        done('Test Failed');
      }
      catch (err: any) {
        if (!signal.aborted) return done('Test Failed');

        expectEqual(signal.reason, abortReason);
        done();
      }
    }

    request();
    abortCtrl.abort(abortReason);
  });
});
