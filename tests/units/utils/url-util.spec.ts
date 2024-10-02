import chai, { expect } from '@esm-bundle/chai';
// @ts-ignore
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import { buildUrl, createUrl } from '../../../src/utils/url-util';

chai.use(chaiAsPromised);

describe('Util - Url', () => {

  it('should build valid URL', () => {
    // url with origin overrides baseUrl+prefix
    const url = buildUrl({
      queryParams: new URLSearchParams(),
      url: 'https://example.com',
      prefix: '/user',
      baseUrl: new URL('http://localhost:8080'),
    });

    expect(url.href).to.be.equal('https://example.com/');
  });

  it('should build valid URL', () => {
    const url = buildUrl({
      queryParams: new URLSearchParams(),
      url: '/one',
      prefix: '/user',
      baseUrl: new URL('http://localhost:8080'),
    });

    expect(url.href).to.be.equal('http://localhost:8080/user/one');
  });

  it('should throw', () => {
    expect(() => createUrl('invalid')).to.throw('Invalid URL: \'invalid\'.');
  });
});
