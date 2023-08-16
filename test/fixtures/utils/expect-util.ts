import { expect } from '@esm-bundle/chai';

export function expectProperty(obj: any, propertyKey: string, type: string, value?: any): Chai.Assertion {
  const assertion: Chai.Assertion = expect(obj)
    .to.have.property(propertyKey)
    .and
    .to.be.a(type);

  if (value !== undefined) assertion
    .and
    .to.be.equal(value);

  return assertion;
}

export function expectEqual(current: any, expected: any, deep: boolean = false): Chai.Assertion {
  const assertion: Chai.Assertion = expect(current).to.be;

  (deep) ? assertion.deep.equal(expected)
    : assertion.equal(expected);

  return assertion;
}

export function expectNotEqual(current: any, expected: any, deep: boolean = false): Chai.Assertion {
  const assertion: Chai.Assertion = expect(current).to.not.be;

  (deep) ? assertion.deep.equal(expected)
    : assertion.equal(expected);

  return assertion;
}

export function expectType(current: any, type: string): Chai.Assertion {
  return expect(current)
    .to.be.a(type);
}
