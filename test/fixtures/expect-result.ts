import { expect } from '@esm-bundle/chai';

export interface JsonPlaceholderPost {
  title: string;
  body: string;
  userId: number;
}

export function expectJsonPlaceholderPost(result: unknown): void {
  expect(result).to.have.property('title').and.to.be.a('string');
  expect(result).to.have.property('body').and.to.be.a('string');
  expect(result).to.have.property('userId').and.to.be.a('number');
  expect(result).to.have.property('id').and.to.be.a('number');
}
