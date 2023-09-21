import drino from '../../src';
import type { DrinoInstance } from '../../src';

describe('Drino - Retry', () => {

  let instance: DrinoInstance;

  beforeEach(() => {
    instance = drino.create({
      baseUrl: 'http://localhost:8080/error',
      requestsConfig: {
        retry: {
          max: 2
        }
      }
    })
  });

  it('should retry twice', () => {
    instance.get('/401')
  });

  it('should not retry', () => {

  });
});
