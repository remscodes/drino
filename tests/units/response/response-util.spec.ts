import { bodyFromReadType } from '../../../src/response/response-util';
import { mockFetchResponse } from '../../fixtures/mocks/fetch-response.mock';
import { expectType } from '../../fixtures/utils/expect-util';

describe('Util - Response', () => {

  describe('bodyFromReadType', () => {

    it('should return String', async () => {
      const result = await bodyFromReadType(mockFetchResponse, 'string');
      expectType(result, 'string');
    });

    it('should return Object', async () => {
      const result = await bodyFromReadType(mockFetchResponse, 'object');
      expectType(result, 'object');
    });

    it('should return FormData', async () => {
      const result = await bodyFromReadType(mockFetchResponse, 'formData');
      expectType(result, 'FormData');
    });

    it('should return Blob', async () => {
      const result = await bodyFromReadType(mockFetchResponse, 'blob');
      expectType(result, 'Blob');
    });

    it('should return ArrayBuffer', async () => {
      const result = await bodyFromReadType(mockFetchResponse, 'arrayBuffer');
      expectType(result, 'ArrayBuffer');
    });
  });
});
