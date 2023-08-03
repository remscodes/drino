import drino, { DrinoRequest } from '../src';
import { expectJsonPlaceholderPost, JsonPlaceholderPost } from './fixtures/expect-result';
import { JSON_PLACEHOLDER_API } from './fixtures/testing-api-res';

describe('Drino Static', () => {

  describe('GET', () => {

    function getPost(): DrinoRequest<JsonPlaceholderPost, 'json'> {
      return drino.get(JSON_PLACEHOLDER_API.GET, {
        read: 'json'
      });
    }

    it('should get result via promise', async () => {
      const result = await getPost().consume();
      expectJsonPlaceholderPost(result);
    });

    it('should get result via callback', (done) => {
      getPost().consume({
        result: (result) => {
          expectJsonPlaceholderPost(result);
          done();
        }
      });
    });
  });

  describe('HEAD', () => {

    it('should ', async () => {
      const result = await drino.head<JsonPlaceholderPost>(JSON_PLACEHOLDER_API.HEAD, {
        headers: {}
      }).consume();
    });
  });

  describe('POST', () => {

    it('should ', async () => {
      const result = await drino.post(JSON_PLACEHOLDER_API.POST, {}).consume();
    });
  });
});
