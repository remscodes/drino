import type { DrinoInstance, RequestController } from '../../../src';
import drino from '../../../src/drino';

export interface TestError {
  name: string;
}

export class ErrorService {

  private client: DrinoInstance = drino.create({
    baseUrl: 'http://localhost:8080/error'
  });

  public get401(): RequestController<TestError> {
    return this.client.get('/401');
  }

  public get408(timeout: number, signal?: AbortSignal): RequestController<TestError> {
    return this.client.get(`/408/${timeout}`, { signal });
  }

  public get503(): RequestController<TestError> {
    return this.client.get('/503');
  }

  public get504(): RequestController<TestError> {
    return this.client.get('/504');
  }
}
