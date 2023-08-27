import type { PlainObject } from '../../../src/models/shared.model';
import { mergeQueryParams } from '../../../src/utils/params-util';
import { expectEqual } from '../../fixtures/utils/expect-util';

describe('Util - Params', () => {

  it('should merge query params', () => {
    const { key1, value1 } = { key1: 'Test-1', value1: 'test_1' };
    const { key2, value2 } = { key2: 'Test-2', value2: 'test_2' };

    const params1: URLSearchParams = new URLSearchParams();
    params1.set(key1, value1);

    const params2: PlainObject = { [key2]: value2 };

    const finalParams: URLSearchParams = mergeQueryParams(params1, params2);

    expectEqual(finalParams.get(key1), value1);
    expectEqual(finalParams.get(key2), value2);
  });
});
