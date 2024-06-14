import { expect } from '@esm-bundle/chai';
import { buildUrl } from '../../../src/utils/url-util';

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
});
