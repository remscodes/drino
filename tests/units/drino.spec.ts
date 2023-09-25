import type { DrinoInstance } from '../../src';
import drino from '../../src';
import { expectNotEqual } from '../fixtures/utils/expect-util';

describe('Drino', () => {
  let instance: DrinoInstance;

  beforeEach(() => {
    instance = drino.create({
      baseUrl: 'http://localhost'
    });
  });

  it('should change default url origin', () => {
    expectNotEqual(instance.default.baseUrl, instance.default.baseUrl = 'http://localhost/api');
  });

  it('should change all default prefix', () => {
    expectNotEqual(instance.default.requestsConfig.prefix, instance.default.requestsConfig.prefix = '/item', true);
  });
});
