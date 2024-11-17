// @ts-ignore
import { expect } from '@esm-bundle/chai';
import type { SinonSpy } from 'sinon';

export function expectProperty<T extends object>(obj: T, propertyKey: keyof T & string | string, type: string, value?: any): Chai.Assertion {
  const assertion: Chai.Assertion = expect(obj)
    .to.have.property(propertyKey)
    .and
    .to.be.a(type);

  if (value !== undefined) assertion
    .and
    .to.be.equal(value);

  return assertion;
}

export function expectEqual(current: unknown, expected: any, deep: boolean = false): Chai.Assertion {
  const assertion: Chai.Assertion = expect(current).to.be;

  return (deep) ? assertion.deep.equal(expected)
    : assertion.equal(expected);
}

export function expectNotEqual(current: unknown, expected: any, deep: boolean = false): Chai.Assertion {
  const assertion: Chai.Assertion = expect(current).to.not.be;

  return (deep) ? assertion.deep.equal(expected)
    : assertion.equal(expected);
}

export function expectType(current: unknown, type: string): Chai.Assertion {
  return expect(current)
    .to.be.a(type);
}

export function expectToBeCalled(spy: SinonSpy, count: number = 1): Chai.Assertion {
  return expect(spy.callCount)
    .to.be.equal(count);
}

export function expectToBeCalledWith(spy: SinonSpy, ...args: any[]): Chai.Assertion {
  return expect(spy.calledOnceWithExactly(...args))
    .to.be.true;
}
