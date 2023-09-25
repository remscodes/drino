import type { DrinoInstance, HttpResponse, RequestController } from '../../../src';
import drino from '../../../src';

export interface TestItem {
  id: number;
  name: string;
}

export class ItemService {

  private client: DrinoInstance = drino.create({
    baseUrl: 'http://localhost:8080/item'
  });

  public getHeaders(): RequestController<Headers> {
    return this.client.head('/');
  }

  public createItem(name: string): RequestController<TestItem> {
    return this.client.post('/', { name });
  }

  public putItem(item: TestItem): RequestController<TestItem> {
    return this.client.put(`/${item.id}`, item);
  }

  public patchItem(item: TestItem): RequestController<TestItem> {
    return this.client.patch(`/${item.id}`, item);
  }

  public getOneItem(id: number): RequestController<TestItem> {
    return this.client.get(`/${id}`);
  }

  public deleteOneItem(id: number): RequestController<HttpResponse<void>> {
    return this.client.delete(`/${id}`, { read: 'none', wrapper: 'response' });
  }

  public getWrappedItems(): RequestController<HttpResponse<TestItem[]>> {
    return this.client.get('/', { wrapper: 'response' });
  }
}
