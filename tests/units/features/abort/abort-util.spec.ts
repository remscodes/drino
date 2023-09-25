import { defaultSignal, timedSignal } from '../../../../src/features/abort/abort-util';
import { expectProperty, expectType } from '../../../fixtures/utils/expect-util';

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
});
