import { keysCount } from '../../../src/utils/object-util';
import { expectEqual } from '../../fixtures/utils/expect-util';

describe('Util - Object', () => {

  it('should return object keys count', () => {
    const obj: object = { name: 'John', mood: 'good' };
    expectEqual(keysCount(obj), 2);
  });
});
