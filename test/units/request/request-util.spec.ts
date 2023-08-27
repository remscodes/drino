import { RequestConfig } from '../../../src';
import { DrinoDefaultConfigInit } from '../../../src/models/drino.model';
import { mergeRequestConfigs } from '../../../src/request/request-util';
import { convertBody, inferBodyType } from '../../../src/response/response-util';
import { mockFetchResponse } from '../../fixtures/mocks/fetch-response.mock';
import { expectType } from '../../fixtures/utils/expect-util';

describe('Util - Request', () => {

  describe('convertBody', async () => {
    const bodyObj = await convertBody(mockFetchResponse, 'auto');
    expectType(bodyObj, 'object');

    const bodyStr = await convertBody(mockFetchResponse, 'string');
    expectType(bodyStr, 'string');
  });

  describe('inferBodyType', async () => {
    const body = await inferBodyType(mockFetchResponse);
    expectType(body, 'object');
  });

  describe('mergeRequestConfigs', () => {

    it('should work', () => {

      const drinoConfig: DrinoDefaultConfigInit = {};

      const requestConfig: RequestConfig<any, any> = {};

      mergeRequestConfigs(drinoConfig, requestConfig);
    });
  });
});
