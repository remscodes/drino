import chai, { expect } from '@esm-bundle/chai';
// @ts-ignore
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import type { RequestConfig } from '../../../src';
import type { DrinoDefaultConfigInit } from '../../../src/models/drino.model';
import { mergeRequestConfigs } from '../../../src/request/request-util';
import { convertBody, inferBody } from '../../../src/response/response-util';
import { mockFetchResponse } from '../../fixtures/mocks/fetch-response.mock';
import { expectType } from '../../fixtures/utils/expect-util';

chai.use(chaiAsPromised);

describe('Util - Request', () => {

  describe('convertBody', () => {

    it('should convert to object', async () => {
      const bodyObj = await convertBody(mockFetchResponse, 'auto');
      expectType(bodyObj, 'object');
    });

    it('should convert to string', async () => {
      const bodyStr = await convertBody(mockFetchResponse, 'string');
      expectType(bodyStr, 'string');
    });

    it('should throw with invalid read type', async () => {
      (await expect(convertBody(mockFetchResponse, 'invalid' as any)).to.be
        // @ts-ignore
        .rejectedWith('Cannot parse body because RequestConfig.read (=\'invalid\') is incompatible with \'content-type\' response header (=\'application/json\').'));
    });
  });

  describe('inferBody', () => {

    it('should infer object type', async () => {
      const body = await inferBody(mockFetchResponse);
      expectType(body, 'object');
    });
  });

  describe('mergeRequestConfigs', () => {

    it('should work', () => {
      const requestConfig: RequestConfig<any, any> = {};
      const drinoConfig: DrinoDefaultConfigInit = {};

      mergeRequestConfigs(requestConfig, drinoConfig);
    });
  });
});
