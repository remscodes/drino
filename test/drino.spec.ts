import drino from '../src/drino';
import { expectJsonPlaceholderPost, JsonPlaceholderPost } from './fixtures/expect-result';
import { JSON_PLACEHOLDER_API } from './fixtures/testing-api-res';

describe('Drino Static', () => {

  describe('GET', () => {

    it('should get result via promise', async () => {
      const result = await drino.get<JsonPlaceholderPost>(JSON_PLACEHOLDER_API.GET).consume();
      expectJsonPlaceholderPost(result);
    });

    it('should get result via callback', (done) => {
      drino.get<JsonPlaceholderPost>(JSON_PLACEHOLDER_API.GET).consume({
        result: (result: JsonPlaceholderPost) => {
          expectJsonPlaceholderPost(result);
          done();
        }
      });
    });
  });

  describe.skip('HEAD', () => {

  });
});
