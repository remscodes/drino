import type { DrinoInstance, RequestController, RetryEvent } from '../../src';
import drino from '../../src';
import { expectEqual } from '../fixtures/utils/expect-util';

interface ExpectCountArgs {
  request: RequestController<any>;
  expectedRetry: number;
  expectedDelayMs: number | ((delay: number) => boolean);
  done: Mocha.Done;
}

function expectRetry(args: ExpectCountArgs): void {
  let finalCount: number = 0;
  let finalDelayMs: number = 0;
  args.request.consume({
    retry: ({ count, delay }: RetryEvent) => {
      finalCount = count;
      finalDelayMs += delay;
      // console.log(`Failed. Will retry for the ${count} time(s)`);
    },
    finish: () => {
      expectEqual(finalCount, args.expectedRetry);
      (typeof args.expectedDelayMs === 'number') ? expectEqual(finalDelayMs, args.expectedDelayMs)
        : expectEqual(args.expectedDelayMs(finalDelayMs), true);
      args.done();
    },
  });
}

describe('Drino - Retry', () => {
  let instance: DrinoInstance;

  beforeEach(() => {
    instance = drino.create({
      baseUrl: 'http://localhost:8080/error',
      requestsConfig: {
        retry: { max: 2 },
      },
    });
  });

  it('should retry twice by instance default config', (done: Mocha.Done) => {
    expectRetry({
      request: instance.get('/504'),
      expectedRetry: 2,
      expectedDelayMs: 0,
      done,
    });
  });

  it('should not retry', (done: Mocha.Done) => {
    expectRetry({
      request: instance.get('/401'),
      expectedRetry: 0,
      expectedDelayMs: 0,
      done,
    });
  });

  it('should override retry config and retry three times', (done: Mocha.Done) => {
    expectRetry({
      request: instance.get('/504', { retry: { max: 3 } }),
      expectedRetry: 3,
      expectedDelayMs: 0,
      done,
    });
  });

  it('should abort retrying at the second time', (done: Mocha.Done) => {
    let finalCount: number = 0;

    instance.get('/504', {
      retry: { max: 10 },
    }).consume({
      retry: ({ count, abort }: RetryEvent) => {
        finalCount = count;
        if (finalCount === 2) abort();
      },
      finish: () => {
        expectEqual(finalCount, 2);
        done();
      },
    });
  });

  it('should not retry on GET method', (done: Mocha.Done) => {
    const mInstance: DrinoInstance = instance.child({
      requestsConfig: {
        retry: { max: 1, onStatus: [401], onMethods: ['POST'] },
      },
    });

    expectRetry({
      request: mInstance.get('/401'),
      expectedRetry: 0,
      expectedDelayMs: 0,
      done,
    });
  });

  it('should retry with retry after header (second format)', (done: Mocha.Done) => {
    expectRetry({
      request: instance.get('/503', { retry: { max: 1 } }),
      expectedRetry: 1,
      expectedDelayMs: 300,
      done,
    });
  });

  it('should retry with retry after header (date format)', (done: Mocha.Done) => {
    expectRetry({
      request: instance.get('/503', { retry: { max: 1 }, queryParams: { format: 'date' } }),
      expectedRetry: 1,
      expectedDelayMs: (delay: number) => (delay < 1000),
      done,
    });
  });

  it('should retry with delay', (done: Mocha.Done) => {
    expectRetry({
      request: instance.get('/503', { retry: { max: 1, withRetryAfter: false, withDelayMs: 200 } }),
      expectedRetry: 1,
      expectedDelayMs: 200,
      done,
    });
  });
});
