import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';
import drino from '../src';
import { mockFetch } from './mocks/fetch.mock';

describe('Drino static', () => {

  const mockBody = {
    id: 1,
    name: 'Pet1',
    photoUrls: ['test1', "test2"],
    tags: [],
    status: 'available'
  };

  before(() => {
    mockFetch(mockBody);
  });

  it('should get result via promise', async () => {
    try {
      const result = await drino.get('https://petstore3.swagger.io/api/v3/pet/1').consume();
      console.log('Promise result :', result);
    } catch (err) {
      console.error('Promise error :', err);
    } finally {
      console.log('Promise finish.');
    }
  });

  it('should get result via callback', (t, done) => {
    drino
      .get('https://petstore3.swagger.io/api/v3/pet/1')
      .consume({
        result: (result: any) => {
          console.log('Callback result :', result);
          assert.equal(result.name, mockBody.name);
          done();
        },
        error: (err: any) => {
          console.log('Callback error :', err);
        },
        finish: () => {
          console.log('Callback finish.');
        }
      });
  });
});
