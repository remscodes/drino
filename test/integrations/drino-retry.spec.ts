import type { DrinoInstance, RequestController, RetryArgs } from '../../src';
import drino from '../../src';
import { expectEqual } from '../fixtures/utils/expect-util';

interface ExpectCountArgs {
  request: RequestController<any>;
  expectedRetry: number;
  done: Mocha.Done;
}

function expectRetry(args: ExpectCountArgs): void {
  let finalCount: number = 0;
  args.request.consume({
    retry: ({ count }: RetryArgs) => {
      finalCount = count;
      // console.log(`Failed. Will retry for the ${count} time(s)`);
    },
    finish: () => {
      expectEqual(finalCount, args.expectedRetry);
      args.done();
    }
  });
}

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

  it('should retry twice by instance default config', (done: Mocha.Done) => {
    expectRetry({
      request: instance.get('/503'),
      expectedRetry: 2,
      done
    });
  });

  it('should not retry', (done: Mocha.Done) => {
    expectRetry({
      request: instance.get('/401'),
      expectedRetry: 0,
      done
    });
  });

  it('should override retry config and retry three times', (done: Mocha.Done) => {
    expectRetry({
      request: instance.get('/503', { retry: { max: 3 } }),
      expectedRetry: 3,
      done
    });
  });

  it('should abort retrying at the second time', (done: Mocha.Done) => {
    let finalCount: number = 0;

    instance.get('/503', {
      retry: { max: 10 }
    }).consume({
      retry: ({ count, abort }: RetryArgs) => {
        finalCount = count;
        if (finalCount === 2) abort();
      },
      finish: () => {
        expectEqual(finalCount, 2);
        done();
      }
    });
  });

  it('should retry on 401 status', (done: Mocha.Done) => {
    instance.get('/503', { retry: { onStatus: [401], max: 1 } }).consume({
      retry: ({}: RetryArgs) => done(''),
      finish: () => {
        expectRetry({
          request: instance.get('/401', { retry: { onStatus: [401], max: 1 } }),
          expectedRetry: 1,
          done
        });
      }
    });
  });

  it('should retry only on POST method', (done: Mocha.Done) => {
    const mInstance: DrinoInstance = instance.child({
      requestsConfig: {
        retry: { max: 1, onStatus: [401], onMethods: ['POST'] }
      }
    });

    expectRetry({
      request: mInstance.post('/401', {}),
      expectedRetry: 1,
      done
    });
  });
});
