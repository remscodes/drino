import { defaultSignal, mergeSignals, timedSignal } from '../../../../src/features/abort/abort-util';
import { sleep } from '../../../../src/utils/promise-util';
import { expectEqual, expectProperty, expectType } from '../../../fixtures/utils/expect-util';

describe('Util - Abort', () => {

  describe('defaultSignal', () => {

    it('should get a signal', () => {
      expectType(defaultSignal(), 'AbortSignal');
    });
  });

  describe('timedSignal', () => {

    it('should get a timed signal', () => {
      const signal: AbortSignal = timedSignal(0);

      expectType(signal, 'AbortSignal');
      expectProperty(signal, 'hasTimeout', 'boolean', true);
    });
  });

  describe('mergeSignals', () => {

    it('should return an aborted signal', () => {
      const abortCtrl1: AbortController = new AbortController();
      const abortCtrl2: AbortController = new AbortController();

      const reason: string = 'reason';

      abortCtrl1.abort(reason);

      const { signal } = mergeSignals(abortCtrl1.signal, abortCtrl2.signal);

      expectEqual(signal.aborted, true);
      expectEqual(signal.reason, reason);
    });

    it('should abort because of timeout', async () => {
      const signal1: AbortSignal = new AbortController().signal;
      const signal2: AbortSignal = timedSignal(0);

      await sleep(0);

      const { signal } = mergeSignals(signal1, signal2);

      expectEqual(signal.aborted, true);
      expectEqual(signal.timeout, true);
    });
  });

  describe('fixFirefoxAbortError', () => {

  });

  describe('fixFirefoxAbortError', () => {

  });
});
