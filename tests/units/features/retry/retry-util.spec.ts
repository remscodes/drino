import { matchStatus } from '../../../../src/features/retry/retry-util';
import { expectEqual } from '../../../fixtures/utils/expect-util';

describe('Retry - Util', () => {

  describe('matchStatus', () => {

    it('should be number range', () => {
      const matches = matchStatus({ start: 200, end: 299 }, 204);
      expectEqual(matches, true);
    });

    it('should be number ranges', () => {
      const matches = matchStatus([
        { start: 200, end: 210 },
        { start: 290, end: 299 },
      ], 204);
      expectEqual(matches, true);
    });

    it('should be empty array', () => {
      const matches = matchStatus([], 204);
      expectEqual(matches, false);
    });
  });
});
