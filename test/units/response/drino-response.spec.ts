import { HttpResponse } from '../../../src';
import { expectProperty } from '../../fixtures/utils/expect-util';

describe('DrinoResponse', () => {

  const url: string = 'http://localhost';
  const headers: Headers = new Headers();
  const status: number = 200;
  const statusText: string = 'OK';
  const body: number = 1;
  const ok: boolean = true;

  it('should initialize', () => {
    const res: HttpResponse<number> = new HttpResponse({ url, headers, status, statusText, body, ok });

    expectProperty(res, 'url', 'URL');
    expectProperty(res, 'headers', 'Headers', headers);
    expectProperty(res, 'status', 'number', status);
    expectProperty(res, 'statusText', 'string', statusText);
    expectProperty(res, 'body', 'number', body);
    expectProperty(res, 'ok', 'boolean', ok);
  });
});
