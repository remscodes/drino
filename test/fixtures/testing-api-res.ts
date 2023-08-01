import { RequestMethodType } from '@_/models/http.model';

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
