import type { DrinoInstance, HttpResponse, RequestController } from '../../src';
import drino from '../../src';

export interface TestItem {
  id?: number;
  name?: string;
}

export class DrinoService {

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

  public getItems(): RequestController<TestItem[]> {
    return this.client.get('/');
  }

  public getOneItem(id: number): RequestController<TestItem> {
    return this.client.get(`/${id}`);
  }

  public deleteOneItem(id: number): RequestController<HttpResponse<void>> {
    return this.client.delete(`/${id}`, { read: 'none', wrapper: 'response' });
  }

  // public getOptions(): RequestController<Headers> {
  //   return this.client.options(`/`);
  // }

  public longRequest(signal: AbortSignal): RequestController<HttpResponse<void>> {
    return this.client.head('/request/long', { signal, read: 'none' });
  }

  public getWrappedItems(): RequestController<HttpResponse<TestItem[]>> {
    return this.client.get('/', { wrapper: 'response' });
  }
}
