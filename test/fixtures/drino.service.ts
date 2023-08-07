import drino, { RequestController } from '../../src';
import type { JsonPlaceholderPost } from './expect-result';
import { JSON_PLACEHOLDER_API } from './testing-api-res';

export class DrinoService {

  public getPost(): RequestController<JsonPlaceholderPost> {
    return drino
      .get<JsonPlaceholderPost>(JSON_PLACEHOLDER_API.GET, { read: 'object' });
  }
}
