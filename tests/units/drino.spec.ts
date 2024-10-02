import type { DrinoInstance } from '../../src';
import drino from '../../src';
import { expectEqual, expectNotEqual } from '../fixtures/utils/expect-util';

describe('Drino', () => {
  let instance: DrinoInstance;

  beforeEach(() => {
    instance = drino.create({});
  });

  it('should have default url origin', () => {
    expectEqual(instance.default.baseUrl, window.location.origin);
  });

  it('should change default url origin', () => {
    expectNotEqual(instance.default.baseUrl, instance.default.baseUrl = 'http://localhost/api');
  });

  it('should change all default prefix', () => {
    expectNotEqual(instance.default.requestsConfig.prefix, instance.default.requestsConfig.prefix = '/item', true);
  });
});
