import type { DrinoInstance } from '../../src';
import drino from '../../src';

describe('Drino - Interceptors', () => {

  let instance: DrinoInstance;

  before(() => {
    instance = drino.create({
        requestsConfig: {
          interceptors: {

          }
        }
      }
    );
  });

  it('should ', () => {

  });
});
