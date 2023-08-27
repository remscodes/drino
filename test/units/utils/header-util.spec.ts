import type { PlainObject } from '../../../src/models/shared.model';
import { inferContentType, mergeHeaders } from '../../../src/utils/headers-util';
import { expectEqual } from '../../fixtures/utils/expect-util';

describe('Util - Headers', () => {

  describe('mergeHeaders', () => {

    it('should work', () => {
      const { key1, value1 } = { key1: 'Test-1', value1: 'test_1' };
      const { key2, value2 } = { key2: 'Test-2', value2: 'test_2' };

      const headers1: Headers = new Headers();
      headers1.set(key1, value1);

      const headers2: PlainObject = { [key2]: value2 };

      const finalHeaders: Headers = mergeHeaders(headers1, headers2);

      expectEqual(finalHeaders.get(key1), value1);
      expectEqual(finalHeaders.get(key2), value2);
    });
  });

  describe('inferContentType', () => {

    it('should work', () => {
      const formData: FormData = new FormData();
      const blob: Blob = new Blob();
      const str: string = 'string';
      const obj: object = {};

      expectEqual(inferContentType(formData), 'multipart/form-data');
      expectEqual(inferContentType(blob), 'application/octet-stream');
      expectEqual(inferContentType(str), 'text/plain');
      expectEqual(inferContentType(obj), 'application/json');
    });
  });
});
