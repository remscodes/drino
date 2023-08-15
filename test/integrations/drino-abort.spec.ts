import { expect } from '@esm-bundle/chai';
import { isAbortError } from '../../src/utils';
import { DrinoService } from '../fixtures/drino.service';

describe('Drino - Abort', () => {
  const service: DrinoService = new DrinoService();
  const abortReason: string = 'Too Long';

  let abortCtrl: AbortController;
  let signal: AbortSignal;

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
        expect(reason).to.be.equal(abortReason);
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
        if (isAbortError(err) && signal.aborted) {
          expect(signal.reason).to.be.equal(abortReason);
          done();
        }
        else {
          done('Test Failed');
        }
      }
    }

    request();
    abortCtrl.abort(abortReason);
  });
});
