import { bodyFromReadType } from '../../../src/utils/response-util';
import { expectType } from '../../fixtures/utils/expect-util';
import { mockFetchResponse } from '../../fixtures/mocks/fetch-response.mock';

describe('Util - Response', () => {

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
