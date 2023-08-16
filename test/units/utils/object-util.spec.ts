import { keysOf } from '../../../src/utils/object-util';
import { expectEqual } from '../../fixtures/utils/expect-util';

describe('Util - Object', () => {

  it('should return object keys', () => {
    const obj: object = { name: 'John', mood: 'good' };
    expectEqual(keysOf(obj), ['name', 'mood'], true);
  });
});
