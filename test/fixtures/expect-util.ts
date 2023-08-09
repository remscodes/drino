import { expect } from '@esm-bundle/chai';

export function expectProperty(obj: any, propertyKey: string, type: string, value?: any): void {
  const assertion = expect(obj)
    .to.have.property(propertyKey)
    .and
    .to.be.a(type);

  if (value !== undefined) assertion
    .and
    .to.be.equal(value);
}
