import type { HttpContextToken } from './http-context-token';

export class HttpContext {

  public constructor(
    init?: [HttpContextToken<any>, any][],
  ) {
    init?.forEach(([token, value]) => this.set(token, value));
  }

  private map = new Map<HttpContextToken<any>, any>();

  public set<T>(token: HttpContextToken<T>, value: T): HttpContext {
    this.map.set(token, value);
    return this;
  }

  public has(token: HttpContextToken<any>): boolean {
    return this.map.has(token);
  }

  public get<T>(token: HttpContextToken<T>): T {
    return this.map.get(token);
  }

  public delete(token: HttpContextToken<any>): HttpContext {
    this.map.delete(token);
    return this;
  }

  public keys = this.map.keys;
  public entries = this.map.entries;
}
