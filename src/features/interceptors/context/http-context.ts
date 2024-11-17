import type { HttpContextToken } from './http-context-token';

export class HttpContext {

  public constructor(init?: HttpContextInit[]) {
    init?.forEach(({ token, value }) => this.set(token, value));
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
    const value = this.map.get(token);
    if (value === undefined) return token.default;
    return value;
  }

  public delete(token: HttpContextToken<any>): HttpContext {
    this.map.delete(token);
    return this;
  }

  public keys(): HttpContextToken<any>[] {
    return Array.from(this.map.keys());
  }

  public entries(): [HttpContextToken<any>, any][] {
    return Array.from(this.map.entries());
  }
}

interface HttpContextInit<T = any> {
  token: HttpContextToken<T>;
  value: T;
}
