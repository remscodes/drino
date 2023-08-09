import { RequestMethodType } from '../../src/models/http.model';
import { expectProperty } from './expect-util';

const baseUrl: string = 'https://jsonplaceholder.typicode.com';

export const JSON_PLACEHOLDER_API: Record<RequestMethodType, string> = {
  GET: `${baseUrl}/posts/1`,
  HEAD: `${baseUrl}/posts/1`,
  DELETE: `${baseUrl}/posts/1`,
  OPTIONS: `${baseUrl}/posts/1`,
  POST: `${baseUrl}/posts`,
  PUT: `${baseUrl}/posts/1`,
  PATCH: `${baseUrl}/posts/1`
};

export interface JsonPlaceholderItem {
  id?: number;
  title?: string;
  body?: string;
  userId?: number;
}

export function expectJsonPlaceholderPost(result: unknown): void {
  expectProperty(result, 'id', 'number');
  expectProperty(result, 'title', 'string');
  expectProperty(result, 'body', 'string');
  expectProperty(result, 'userId', 'number');
}
