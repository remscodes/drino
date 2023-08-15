import type { DrinoInstance, DrinoResponse, RequestController } from '../../src';
import drino from '../../src';

export interface TestItem {
  id?: number;
  name?: string;
}

const mainDrino: DrinoInstance = drino.create({
  baseUrl: 'http://localhost:8080'
});

export class DrinoService {

  private client: DrinoInstance = mainDrino.child({
    requestConfig: {
      prefix: '/item'
    }
  });

  public getHeaders(): RequestController<void> {
    return this.client.head('/', { read: 'none' });
  }

  public createItem(name: string): RequestController<TestItem> {
    return this.client.post('/', { name });
  }

  public getItems(): RequestController<TestItem> {
    return this.client.get('/item');
  }

  public getOneItem(id: number): RequestController<TestItem> {
    return this.client.get(`/${id}`);
  }

  public deleteOneItem(id: number): RequestController<DrinoResponse<void>> {
    return this.client.delete(`/${id}`, { read: 'response' });
  }

  public longRequest(signal: AbortSignal): RequestController<void> {
    return this.client.head('/long', { read: 'none', signal });
  }
}
