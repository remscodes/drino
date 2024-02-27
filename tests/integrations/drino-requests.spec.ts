import { expect } from '@esm-bundle/chai';
import type { HttpResponse } from '../../src';
import drino from '../../src';
import type { TestItem } from '../fixtures/services/item-service';
import { ItemService } from '../fixtures/services/item-service';
import { expectEqual, expectProperty, expectType } from '../fixtures/utils/expect-util';

describe('Drino - Requests', () => {
  const service: ItemService = new ItemService();

  describe('External request', () => {

    it('should fetch catfact', async () => {
      const res = await drino.get('https://catfact.ninja/fact', {
        progress: { download: { inspect: false } },
      }).consume();

      expectType(res, 'object');
    });

    it('should fetch catfact', async () => {
      const instance = drino.create({
        baseUrl: 'http://localhost:3000',
      });

      const res = await instance.get('https://catfact.ninja/fact', {
        progress: { download: { inspect: false } },
      }).consume();

      expectType(res, 'object');
    });
  });

  describe('GET', () => {
    const id: number = 1;

    it('should retrieve result from Observer', (done: Mocha.Done) => {
      service.getOneItem(id).consume({
        result: (result: TestItem) => {
          expectProperty(result, 'id', 'number', id);
          expectProperty(result, 'name', 'string');
          done();
        },
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
        },
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
        },
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
    const updatedItem: TestItem = {
      id: 1,
      name: 'Updated First Item',
    };

    it('should retrieve result from Observer', (done: Mocha.Done) => {
      service.putItem(updatedItem).consume({
        result: (result: TestItem) => {
          expectProperty(result, 'id', 'number', updatedItem.id);
          expectProperty(result, 'name', 'string', updatedItem.name);
          done();
        },
      });
    });

    it('should retrieve result from Promise', async () => {
      const result: TestItem = await service.putItem(updatedItem).consume();

      expectProperty(result, 'id', 'number', updatedItem.id);
      expectProperty(result, 'name', 'string', updatedItem.name);
    });
  });

  describe('PATCH', () => {
    const updatedItem: TestItem = {
      id: 1,
      name: 'Updated Second Item',
    };

    it('should retrieve result from Observer', (done: Mocha.Done) => {
      service.patchItem(updatedItem).consume({
        result: (result) => {
          expectProperty(result, 'id', 'number', updatedItem.id);
          expectProperty(result, 'name', 'string', updatedItem.name);
          done();
        },
      });
    });

    it('should retrieve result from Promise', async () => {
      const result: TestItem = await service.patchItem(updatedItem).consume();

      expectProperty(result, 'id', 'number', updatedItem.id);
      expectProperty(result, 'name', 'string', updatedItem.name);
    });
  });

  // describe.skip('OPTIONS', async () => {
  //
  //   it('should retrieve result from Observer', (done: Mocha.Done) => {
  //
  //     service.getOptions().consume({
  //       result: (headers: Headers) => {
  //         expectType(headers, 'Headers');
  //         done();
  //       }
  //     });
  //   });
  //
  //   it('should retrieve result from Promise', async () => {
  //     const headers: Headers = await service.getOptions().consume();
  //
  //     expectType(headers, 'Headers');
  //   });
  // });

  describe('DELETE', () => {

    it('should retrieve result from Observer', (done: Mocha.Done) => {
      const id: number = 1;

      service.deleteOneItem(id).consume({
        result: ({ status }: HttpResponse<void>) => {
          expectEqual(status, 204);
          done();
        },
      });
    });

    it('should retrieve result from Promise', async () => {
      const id: number = 2;

      const { status }: HttpResponse<void> = await service.deleteOneItem(id).consume();

      expectEqual(status, 204);
    });
  });

  describe('NO CONTENT', () => {

    it('should get nothing', (done) => {
      drino.get('http://localhost:8080/empty').consume({
        result: (value) => {
          expect(value).to.be.undefined;
          done();
        },
      });
    });

    it('should get nothing', async () => {
      const value = await drino.get('http://localhost:8080/empty').consume();
      expect(value).to.be.undefined;
    });
  });
});
