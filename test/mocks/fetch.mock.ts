export function mockFetch(body: any) {
  // @ts-ignore
  global.fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => {
    return Promise.resolve({
      json: () => Promise.resolve(body),
      ok: true,
      headers: new Map()
    });
  };
}
