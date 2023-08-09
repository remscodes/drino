import type { TestItem } from './fixtures/drino.service';
import { DrinoService } from './fixtures/drino.service';
import { expectProperty } from './fixtures/expect-util';

describe('Drino', () => {

  const service: DrinoService = new DrinoService();

  describe('GET', () => {

    it.only('should get item using GET and retrieve result from Promise', async () => {
      const id: number = 1;

      const result = await service.getOneItem(id).consume();

      expectProperty(result, 'id', 'number', id);
      expectProperty(result, 'name', 'string');
    });

    it('should get item using GET and retrieve result from Observer', (done) => {
      const id: number = 1;

      service.getOneItem(id).consume({
        result: (result) => {
          expectProperty(result, 'id', 'number', id);
          expectProperty(result, 'name', 'string');

          done();
        }
      });
    });
  });

  describe('HEAD', () => {

    it('should get headers using HEAD and retrieve result from Promise ', async () => {
      const result = await service.getHeaders().consume();
      console.log(result);
    });
  });

  describe('POST', () => {

    it('should create item using POST and retrieve result from Promise', async () => {
      const itemName: string = 'With Promise';

      const result: TestItem = await service.createItem(itemName).consume();

      expectProperty(result, 'id', 'number');
      expectProperty(result, 'name', 'string', itemName);
    });

    it('should create item using POST and retrieve result from Observer', (done) => {
      const itemName: string = 'With Observer';

      service.createItem(itemName).consume({
        result: (result: TestItem) => {
          expectProperty(result, 'id', 'number');
          expectProperty(result, 'name', 'string', itemName);

          done();
        }
      });
    });
  });

  describe.skip('PUT', () => {
    it('should update item using PUT and retrieve result from Promise', async () => {
      const itemName: string = 'With Promise';

      const result: TestItem = await service.createItem(itemName).consume();

      expectProperty(result, 'id', 'number');
      expectProperty(result, 'name', 'string', itemName);
    });
  });

  describe.skip('DELETE', () => {
    const id: number = 1;
  });

  describe.skip('OPTIONS', () => {

  });

  describe.skip('PATCH', () => {

  });
});
