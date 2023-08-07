import drino from '../src';
import { DrinoService } from './fixtures/drino.service';
import type { JsonPlaceholderPost } from './fixtures/expect-result';
import { expectJsonPlaceholderPost } from './fixtures/expect-result';
import { JSON_PLACEHOLDER_API } from './fixtures/testing-api-res';

describe('Drino Static', () => {

  const service = new DrinoService();

  describe('GET', () => {

    it('should get result via promise', async () => {
      const result = await service.getPost().consume();
      expectJsonPlaceholderPost(result);
    });

    it('should get result via callback', (done) => {
      service.getPost().consume({
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
