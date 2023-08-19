import { HttpResponse } from '../../../src';
import { expectProperty } from '../../fixtures/utils/expect-util';

describe('HttpResponse', () => {

  const url: string = 'http://localhost';
  const headers: Headers = new Headers();
  const status: number = 200;
  const statusText: string = 'OK';
  const body: object = {};

  it('should initialize', () => {
    const res: HttpResponse<object> = new HttpResponse({ url, headers, status, statusText, body });

    expectProperty(res, 'url', 'URL');
    expectProperty(res, 'headers', 'Headers', headers);
    expectProperty(res, 'status', 'number', status);
    expectProperty(res, 'statusText', 'string', statusText);
    expectProperty(res, 'body', 'object', body);
  });
});
