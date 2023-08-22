import drino, { DrinoInstance } from '../../src';
import { expectNotEqual } from '../fixtures/utils/expect-util';

describe('Drino', () => {

  let instance: DrinoInstance;

  beforeEach(() => {
    instance = drino.create({
      urlOrigin: 'http://localhost'
    });
  });

  it('should change default config', () => {
    expectNotEqual(instance.default.urlOrigin, instance.default.urlOrigin = 'http://localhost/api', true);
  });

  it('should change all default config', () => {
    expectNotEqual(instance.default, instance.default = {}, true);
  });
});
