import type { TestItem } from '../fixtures/drino.service';
import { DrinoService } from '../fixtures/drino.service';
import { expectProperty } from '../fixtures/utils/expect-util';

describe('Drino - Requests', () => {

  const service: DrinoService = new DrinoService();

  describe('GET', () => {

    it('should retrieve result from Observer', (done: Mocha.Done) => {
      const id: number = 1;

      service.getOneItem(id).consume({
        result: (result: TestItem) => {
          expectProperty(result, 'id', 'number', id);
          expectProperty(result, 'name', 'string');
          done();
        }
      });
    });

    it('should retrieve result from Promise', async () => {
      const id: number = 1;

      const result: TestItem = await service.getOneItem(id).consume();

      expectProperty(result, 'id', 'number', id);
      expectProperty(result, 'name', 'string');
    });
  });

  describe('HEAD', () => {

    it('should retrieve headers from Promise ', async () => {
      const response = await service.getHeaders().consume();
    });
  });

  describe('POST', () => {

    it('should retrieve result from Observer', (done: Mocha.Done) => {
      const itemName: string = 'With Observer';

      service.createItem(itemName).consume({
        result: (result: TestItem) => {
          expectProperty(result, 'id', 'number');
          expectProperty(result, 'name', 'string', itemName);
          done();
        }
      });
    });

    it('should retrieve result from Promise', async () => {
      const itemName: string = 'With Promise';

      const result: TestItem = await service.createItem(itemName).consume();

      expectProperty(result, 'id', 'number');
      expectProperty(result, 'name', 'string', itemName);
    });
  });

  describe('PUT', () => {

    it('should retrieve result from Observer', (done: Mocha.Done) => {
      const itemName: string = 'With Promise';

      service.createItem(itemName).consume({
        result: (result) => {
          expectProperty(result, 'id', 'number');
          expectProperty(result, 'name', 'string', itemName);
          done();
        }
      });
    });

    it('should retrieve result from Promise', async () => {
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
