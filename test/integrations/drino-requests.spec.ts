import { HttpResponse } from '../../src';
import type { TestItem } from '../fixtures/drino.service';
import { DrinoService } from '../fixtures/drino.service';
import { expectEqual, expectProperty, expectType } from '../fixtures/utils/expect-util';

describe('Drino - Requests', () => {

  const service: DrinoService = new DrinoService();

  describe('GET', () => {

    const id: number = 1;

    it('should retrieve result from Observer', (done: Mocha.Done) => {
      service.getOneItem(id).consume({
        result: (result: TestItem) => {
          expectProperty(result, 'id', 'number', id);
          expectProperty(result, 'name', 'string');
          done();
        }
      });
    });

    it('should retrieve result from Promise', async () => {
      const result: TestItem = await service.getOneItem(id).consume();

      expectProperty(result, 'id', 'number', id);
      expectProperty(result, 'name', 'string');
    });
  });

  describe('HEAD', () => {

    it('should retrieve headers from Observer', (done: Mocha.Done) => {
      service.getHeaders().consume({
        result: (headers: Headers) => {
          expectType(headers, 'Headers');
          done();
        }
      });
    });

    it('should retrieve headers from Promise ', async () => {
      const headers: Headers = await service.getHeaders().consume();

      expectType(headers, 'Headers');
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
    const updatedItem: TestItem = { id: 1, name: 'Updated First Item' };

    it('should retrieve result from Observer', (done: Mocha.Done) => {
      service.putItem(updatedItem).consume({
        result: (result: TestItem) => {
          expectProperty(result, 'id', 'number', updatedItem.id);
          expectProperty(result, 'name', 'string', updatedItem.name);
          done();
        }
      });
    });

    it('should retrieve result from Promise', async () => {
      const result: TestItem = await service.putItem(updatedItem).consume();

      expectProperty(result, 'id', 'number', updatedItem.id);
      expectProperty(result, 'name', 'string', updatedItem.name);
    });
  });

  describe('PATCH', () => {
    const updatedItem: TestItem = { id: 1, name: 'Updated Second Item' };

    it('should retrieve result from Observer', (done: Mocha.Done) => {
      service.patchItem(updatedItem).consume({
        result: (result) => {
          expectProperty(result, 'id', 'number', updatedItem.id);
          expectProperty(result, 'name', 'string', updatedItem.name);
          done();
        }
      });
    });

    it('should retrieve result from Promise', async () => {
      const result: TestItem = await service.patchItem(updatedItem).consume();

      expectProperty(result, 'id', 'number', updatedItem.id);
      expectProperty(result, 'name', 'string', updatedItem.name);
    });
  });

  describe.skip('OPTIONS', async () => {

    it('should retrieve result from Observer', (done: Mocha.Done) => {

      service.getOptions().consume({
        result: (headers: Headers) => {

          expectType(headers, 'Headers');
          done();
        }
      });
    });

    it('should retrieve result from Promise', async () => {
      const headers: Headers = await service.getOptions().consume();

      expectType(headers, 'Headers');
    });
  });

  describe('DELETE', () => {

    it('should retrieve result from Observer', (done: Mocha.Done) => {
      const id: number = 1;

      service.deleteOneItem(id).consume({
        result: ({ status }: HttpResponse<void>) => {
          expectEqual(status, 204);

          done();
        }
      });
    });

    it('should retrieve result from Promise', async () => {
      const id: number = 2;

      const { status }: HttpResponse<void> = await service.deleteOneItem(id).consume();

      expectEqual(status, 204);
    });
  });
});
