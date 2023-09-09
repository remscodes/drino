import type { HttpResponse } from '../../src';
import type { TestItem } from '../fixtures/drino.service';
import { DrinoService } from '../fixtures/drino.service';
import { expectProperty } from '../fixtures/utils/expect-util';

describe('Drino - Wrapper', () => {
  const service = new DrinoService();

  it('should wrap result into a HttpResponse instance', async () => {
    const response: HttpResponse<TestItem[]> = await service.getWrappedItems().consume();

    expectProperty(response, 'body', 'array');
    expectProperty(response, 'status', 'number');
    expectProperty(response, 'statusText', 'string');
  });
});
