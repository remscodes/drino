import { expect } from '@esm-bundle/chai';
import type { PlainObject } from '../../../src/models/shared.model';
import { getRetryAfter, inferContentType, mergeHeaders } from '../../../src/utils/headers-util';
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

  describe('getRetryAfter', () => {

    it('should get delay of 0 ms', () => {
      const delay = getRetryAfter(new Headers());
      expect(delay).to.be.equal(0);
    });

    it('should get delay of 120_000 ms', () => {
      const delay = getRetryAfter(new Headers({ 'retry-after': '120' }));
      expect(delay).to.be.equal(120 * 1_000);
    });

    it('should get delay of 120_500 ms', () => {
      const delay = getRetryAfter(new Headers({ 'retry-after': '120.5' }));
      expect(delay).to.be.equal(120.5 * 1_000);
    });

    // it('should get delay of 120_000 ms', () => {
    //   const now = new Date('Wed, 21 Oct 2015 07:28:00 GMT');
    //   const nowSpy = stub(Date, 'now').returns(now.getTime());
    //
    //   console.log(Date.now());
    //   console.log(now.getTime());
    //
    //   const delay = getRetryAfter(new Headers({ 'retry-after': 'Wed, 21 Oct 2015 07:30:00 GMT' }));
    //   expect(delay).to.be.equal(120_000);
    //
    //   nowSpy.restore();
    // });
  });
});
