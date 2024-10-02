import type { DrinoInstance } from '../../src';
import drino from '../../src';
import { DEFAULT_BASE_URL } from '../../src/request/request.constants';
import { expectEqual, expectNotEqual } from '../fixtures/utils/expect-util';

describe('Drino', () => {
  let instance: DrinoInstance;

  beforeEach(() => {
    instance = drino.create({});
  });

  it('should have default url origin', () => {
    const url = DEFAULT_BASE_URL;
    expectEqual(url, 'http://localhost:8000');
    expectEqual(instance.default.baseUrl, url);
  });

  it('should change default url origin', () => {
    expectNotEqual(instance.default.baseUrl, instance.default.baseUrl = 'http://localhost/api');
  });

  it('should change all default prefix', () => {
    expectNotEqual(instance.default.requestsConfig.prefix, instance.default.requestsConfig.prefix = '/item', true);
  });
});
