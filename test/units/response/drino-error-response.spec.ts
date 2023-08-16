import type { Thror } from 'thror';
import { createError } from 'thror';
import { DrinoErrorResponse } from '../../../src';
import { expectProperty } from '../../fixtures/utils/expect-util';

describe('DrinoErrorResponse', () => {

  const url: string = 'http://localhost';
  const headers: Headers = new Headers();
  const status: number = 503;
  const statusText: string = 'Service Unavailable';
  const error: Thror = createError('Server', 'Cannot reach server.', { status });

  it('should initialize', () => {

    const res: DrinoErrorResponse = new DrinoErrorResponse({ url, headers, status, statusText, error });

    expectProperty(res, 'url', 'URL');
    expectProperty(res, 'headers', 'Headers', headers);
    expectProperty(res, 'status', 'number', status);
    expectProperty(res, 'statusText', 'string', statusText);
    expectProperty(res, 'error', 'Error', error);
  });
});
