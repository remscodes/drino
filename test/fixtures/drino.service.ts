import drino, { DrinoRequest } from '../../src';
import type { JsonPlaceholderPost } from './expect-result';
import { JSON_PLACEHOLDER_API } from './testing-api-res';

export class DrinoService {

  public getPost(): DrinoRequest<JsonPlaceholderPost, 'json'> {
    return drino.get(JSON_PLACEHOLDER_API.GET, { read: 'json' });
  }
}
