import { expect } from '@esm-bundle/chai';

export interface JsonPlaceholderPost {
  title: string;
  body: string;
  userId: number;
}

export function expectJsonPlaceholderPost(result: unknown): void {
  expectProperty(result, 'title', 'string');
  expectProperty(result, 'body', 'string');
  expectProperty(result, 'userId', 'number');
  expectProperty(result, 'id', 'number');
}

export function expectDrinoResponse(result: unknown): void {

}

function expectProperty(obj: any, propertyKey: string, type: string): void {
  expect(obj)
    .to.have.property(propertyKey)
    .and
    .to.be.a(type);
}
