import type { DrinoInstance, RetryArgs } from '../../src';
import drino from '../../src';
import { expectEqual } from '../fixtures/utils/expect-util';

describe('Drino - Retry', () => {
  let instance: DrinoInstance;

  beforeEach(() => {
    instance = drino.create({
      baseUrl: 'http://localhost:8080/error',
      requestsConfig: {
        retry: { max: 2 }
      }
    });
  });

  it('should retry twice', (done: Mocha.Done) => {
    let finalCount: number;

    instance.get('/503').consume({
      retry: ({ count }: RetryArgs) => finalCount = count,
      finish: () => {
        expectEqual(finalCount, 2);
        done();
      }
    });
  });

  it('should retry three times', (done: Mocha.Done) => {
    let finalCount: number;

    instance.get('/503', {
      retry: { max: 3 }
    }).consume({
      retry: ({ count, error }: RetryArgs) => {
        finalCount = count;
        // console.log(error);
        // console.log(`Failed. Will retry for the ${count} time(s)`);
      },
      // error: (e) => console.log(e),
      finish: () => {
        expectEqual(finalCount, 3);
        done();
      }
    });
  });
});
